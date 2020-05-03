import { isLeft } from 'fp-ts/lib/Either';
import { Pubsy } from 'src/lib/Pubsy';
import { Result, Err, Ok } from 'ts-results';
import { getRTCDataXConnection } from 'src/lib/RTCDataX';
import {
  SignalingChannel,
  SignalingMessage,
  SignalingMessageWithDescription,
  SignalingMessageWithCandidate,
} from './SignalingChannel';
import { LocalStreamClient } from './LocalStreamClient';
import { PeerMessage, peerMessage } from './records/PeerMessagingPayload';
import { PeerStream } from './types';

export class WebRTCRemoteConnection {
  private pubsy = new Pubsy<{
    onRemoteStream: { peerId: string; stream: MediaStream };
    onData: PeerMessage;
    // onDataSent: PeerMessage;
  }>();

  private connection: RTCPeerConnection;

  private dataChannel?: RTCDataChannel;

  constructor(
    private iceServers: RTCIceServer[],
    private signalingChannel: SignalingChannel,
    private localStream: LocalStreamClient,
    private peerId: string,
  ) {
    this.connection = new RTCPeerConnection({ iceServers: this.iceServers });

    this.connection.onicecandidate = (event) => this.onicecandidate(event);
    this.connection.onnegotiationneeded = () => this.onnegotiationneeded();
    this.connection.ontrack = (event) => this.ontrack(event);
    this.connection.ondatachannel = (event) => this.prepareDataChannel(event.channel);

    // TODO: Make sure this works with the new SocketX
    this.signalingChannel.onmessage = (msg) => this.onmessage(msg);
  }

  private onicecandidate({ candidate }: RTCPeerConnectionIceEvent) {
    this.signalingChannel.send(this.peerId, { candidate });
  }

  private async onnegotiationneeded() {
    try {
      await this.connection.setLocalDescription(
        await this.connection.createOffer(),
      );
      // send the offer to the other peer
      this.signalingChannel.send(this.peerId, {
        desc: this.connection.localDescription,
      });
    } catch (err) {
      // TODO: Does this need to be part of logic?
      console.error('WebRTCClient Negotiation Error', err);
    }
  }

  private ontrack(event: RTCTrackEvent) {
    this.pubsy.publish('onRemoteStream', {
      peerId: this.peerId,
      stream: event.streams[0],
    });
  }

  private async onmessage(msg: SignalingMessage) {
    // TODO: Type this using io-ts
    try {
      if (msg.desc) {
        // if we get an offer, we need to reply with an answer
        if (msg.desc.type === 'offer') {
          this.onSignallingOffer(msg);
        } else if (msg.desc.type === 'answer') {
          this.onSignalingAnswer(msg);
        } else {
          console.warn('Unsupported SDP type.', msg.desc);
        }
      } else if (msg.candidate) {
        this.onSignalingCandidate(msg);
      }
    } catch (err) {
      console.error('Signaling onmessage Error', err);
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

    this.signalingChannel.send(this.peerId, {
      desc: this.connection.localDescription,
    });
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

    this.prepareDataChannel(dataChannel);
  }

  private prepareDataChannel(baseChannel: RTCDataChannel) {
    const channel = getRTCDataXConnection(baseChannel);

    // TODO hold this for unsubscription
    channel.addEventListener('message', (event) => {
      try {
        const result = peerMessage.decode(JSON.parse(event.data));

        if (isLeft(result)) {
          console.error(
            'WebRTCRemoteConnection: message received but cant be decoded',
            event.data,
          );

          return;
        }

        this.pubsy.publish('onData', result.right);
      } catch (e) {
        console.error('WebRTCRemoteConnection: message received error', e, event.data);
      }
    });

    this.dataChannel = channel;
  }

  close() {
    this.connection.close();
  }

  onRemoteStream = (
    fn: (p: PeerStream) => void,
  ) => this.pubsy.subscribe('onRemoteStream', fn);

  onData = (
    fn: (msg: PeerMessage) => void,
  ) => this.pubsy.subscribe('onData', fn);

  sendData(
    msg: Omit<PeerMessage, 'timestamp' | 'toPeerId'>,
  ): Result<
    PeerMessage,
    {type: 'DataChannelNotReady'; peerId: string}
    > {
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

    this.dataChannel.send(
      JSON.stringify(msgPayload),
    );

    return new Ok(msgPayload);
  }
}
