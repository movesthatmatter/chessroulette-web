import { isLeft } from 'fp-ts/lib/Either';
import { Pubsy } from 'src/lib/Pubsy';
import { Result, Err, Ok } from 'ts-results';
import { getRTCDataXConnection, RTCDataX } from 'src/lib/RTCDataX';
import { logsy } from 'src/lib/logsy';
import config from 'src/config';
// import {
//   SignalingMessageWithDescription,
//   SignalingMessageWithCandidate,
//   SignalingNegotiationMessage,
// } from './SignalingChannel';
import { LocalStreamClient } from './LocalStreamClient';
import { PeerMessage, peerMessage } from './records/PeerMessagingPayload';
import { PeerStream } from './types';
import {
  RTCSignalingChannel, SignalingNegotiationMessage, SignalingMessageWithDescription, SignalingMessageWithCandidate,
} from '../socket/RTCSignalingChannel';

export class WebRTCRemoteConnection {
  private pubsy = new Pubsy<{
    onRemoteStream: { peerId: string; stream: MediaStream };
    onData: PeerMessage;
  }>();

  private connection: RTCPeerConnection;

  private dataChannel?: RTCDataChannel;

  private unsubscribeFromDataChannelOnMessageListener?: () => void;

  constructor(
    // private signalingChannel: SignalingChannel,
    private signalingChannel: RTCSignalingChannel,
    private localStream: LocalStreamClient,
    private peerId: string,
  ) {
    this.connection = new RTCPeerConnection({
      iceServers: [{
        urls: config.REACT_APP_ICE_SERVERS,
      }],
    });

    this.connection.onicecandidate = (event) => this.onicecandidate(event);
    this.connection.onnegotiationneeded = () => this.onnegotiationneeded();
    this.connection.ontrack = (event) => this.ontrack(event);
    this.connection.ondatachannel = (event) =>
      this.prepareDataChannel(getRTCDataXConnection(event.channel));

    // TODO: Make sure this works with the new SocketX
    this.signalingChannel.onMessageType('negotiation', (msg) => {
      if (msg.content.peer_id === this.peerId) {
        this.onmessage(msg.content.forward as SignalingNegotiationMessage);
      }
    });
  }

  private onicecandidate({ candidate }: RTCPeerConnectionIceEvent) {
    if (candidate) {
      this.signalingChannel.negotiateConnection(this.peerId, { candidate });
    }
  }

  private async onnegotiationneeded() {
    try {
      await this.connection.setLocalDescription(
        await this.connection.createOffer(),
      );

      if (!this.connection.localDescription) {
        logsy.error('[WebRTCRemoteConnection] onnegotiationneeded - No connection.LocalDescription');

        return;
      }

      // send the offer to the other peer
      this.signalingChannel.negotiateConnection(
        this.peerId,
        {
          desc: this.connection.localDescription,
        },
      );
    } catch (error) {
      // TODO: Does this need to be part of logic?
      logsy.error(
        '[WebRTCRemoteConnection] Negotiation Uncaught Error',
        error,
      );
    }
  }

  private ontrack(event: RTCTrackEvent) {
    this.pubsy.publish('onRemoteStream', {
      peerId: this.peerId,
      stream: event.streams[0],
    });
  }

  private async onmessage(msg: SignalingNegotiationMessage) {
    // TODO: Type this using io-ts
    try {
      if (msg.desc) {
        // if we get an offer, we need to reply with an answer
        if (msg.desc.type === 'offer') {
          this.onSignallingOffer(msg);
        } else if (msg.desc.type === 'answer') {
          this.onSignalingAnswer(msg);
        } else {
          logsy.warn(
            '[WebRTCRemoteConnection] Signaling Message Error: Unsupported SDP type.',
            msg.desc,
            msg,
          );
        }
      } else if (msg.candidate) {
        this.onSignalingCandidate(msg);
      }
    } catch (err) {
      logsy.error(
        '[WebRTCRemoteConnection] Signaling Message Uncaught Error:',
        err,
      );
    }
  }

  private async onSignallingOffer(msg: SignalingMessageWithDescription) {
    await this.connection.setRemoteDescription(msg.desc);

    const localStream = await this.localStream.start();

    localStream.getTracks().forEach((track) => {
      // Send the Stream to the given Peer
      this.connection.addTrack(track, localStream);
    });

    await this.connection.setLocalDescription(
      await this.connection.createAnswer(),
    );

    if (!this.connection.localDescription) {
      logsy.error('[WebRTCRemoteConnection] onSignallingOffer Error - No connection.LocalDescription');

      return;
    }

    this.signalingChannel.negotiateConnection(this.peerId, { desc: this.connection.localDescription });
  }

  private async onSignalingAnswer(msg: SignalingMessageWithDescription) {
    await this.connection.setRemoteDescription(msg.desc);
  }

  private async onSignalingCandidate(msg: SignalingMessageWithCandidate) {
    await this.connection.addIceCandidate(msg.candidate);
  }

  async startAVChannel() {
    const localStream = await this.localStream.start();

    localStream.getTracks().forEach((track) => {
      this.connection.addTrack(track, localStream);
    });
  }

  async startDataChannel() {
    const dataChannel = this.connection.createDataChannel('dataChannel');

    this.prepareDataChannel(getRTCDataXConnection(dataChannel));
  }

  private prepareDataChannel(channel: RTCDataX) {
    const onMessageHandler = (event: MessageEvent) => {
      try {
        const result = peerMessage.decode(JSON.parse(event.data));

        if (isLeft(result)) {
          logsy.error(
            '[WebRTCRemoteConnection][DataChannelMessageHandler] Message Decoding Error',
            event.data,
          );

          return;
        }

        this.pubsy.publish('onData', result.right);
      } catch (e) {
        logsy.error(
          '[WebRTCRemoteConnection] DataChannelMessageHandler: Message JSON Parsing Error',
          event.data,
          e,
        );
      }
    };

    channel.addEventListener('message', onMessageHandler);

    this.unsubscribeFromDataChannelOnMessageListener = () => {
      channel.removeEventListener('message', onMessageHandler);
    };

    this.dataChannel = channel;
  }

  close() {
    this.connection.close();

    this.unsubscribeFromDataChannelOnMessageListener?.();
  }

  onRemoteStream = (fn: (p: PeerStream) => void) =>
    this.pubsy.subscribe('onRemoteStream', fn);

  onData = (fn: (msg: PeerMessage) => void) =>
    this.pubsy.subscribe('onData', fn);

  sendData(
    msg: Pick<PeerMessage, 'msgType' | 'content' | 'fromPeerId'>,
  ): Result<PeerMessage, { type: 'DataChannelNotReady'; peerId: string }> {
    if (!this.dataChannel) {
      return new Err({
        type: 'DataChannelNotReady',
        peerId: this.peerId,
      });
    }

    const msgPayload: PeerMessage = {
      ...msg,
      timestamp: String(new Date().getTime()),
      toPeerId: this.peerId,
    };

    this.dataChannel.send(JSON.stringify(msgPayload));

    return new Ok(msgPayload);
  }
}
