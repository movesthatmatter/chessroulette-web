/* eslint-disable no-param-reassign */
import { isLeft } from 'fp-ts/lib/Either';
import { Pubsy } from 'src/lib/Pubsy';
import { Result, Err, Ok } from 'ts-results';
import { getRTCDataXConnection, RTCDataX } from 'src/lib/RTCDataX';
import { logsy } from 'src/lib/logsy';
import config from 'src/config';
import {
  PeerMessageEnvelope,
  peerMessageEnvelope,
} from './records/PeerMessagingEnvelopePayload';
import { PeerStream, PeerConnectionStatus } from './types';
import {
  RTCSignalingChannel,
  SignalingNegotiationMessage,
  SignalingMessageWithDescription,
  SignalingMessageWithCandidate,
} from '../socket/RTCSignalingChannel';
import { AVStreaming } from '../AVStreaming';

export class RTCClient {
  private pubsy = new Pubsy<{
    // onRemoteStream: { peerId: string; stream: MediaStream };
    // onData: PeerMessageEnvelope;


    onRemoteStream: MediaStream;
    onDataChannelOpen: RTCDataX;
    onDataChannelClose: null;
  }>();

  public connection: RTCPeerConnection;

  public onDataChannelOpen?: (channel: RTCDataX) => void;

  public onDataChannelClose?: () => void;

  public onRemoteStream?: (stream: MediaStream) => void;

  private dataChannel?: RTCDataX;

  // private unsubscribers: {
  //   dataChannel: Function[];
  // } = {
  //   dataChannel: [],
  // }

  constructor(
    private signalingChannel: RTCSignalingChannel,
    // private localStream: AVStreaming,
    private peerId: string,
    // private messageHandlerDeleagate: {

    // }
  ) {
    this.connection = new RTCPeerConnection({
      iceServers: [
        {
          urls: config.REACT_APP_ICE_SERVERS,
        },
      ],
    });

    this.connection.onicecandidate = (event) => this.onicecandidate(event);
    this.connection.onnegotiationneeded = () => this.onnegotiationneeded();

    // TODO This needs an unsubscriber
    this.signalingChannel.onMessageType('negotiation', (msg) => {
      if (msg.content.peerId === this.peerId) {
        this.onSignalingNegotiationMessage(
          msg.content.forward as SignalingNegotiationMessage,
        );
      }
    });

    // Audio Video
    this.connection.ontrack = (event) => {
      // this.pubsy.publish('onRemoteStream', {
      //   peerId: this.peerId,
      //   stream: event.streams[0],
      // });
      // this.pubsy.publish('onRemoteStream', event.streams[0]);
      this.onRemoteStream?.(event.streams[0]);
    };

    // Data
    this.connection.ondatachannel = (event) =>
      this.prepareDataChannel(getRTCDataXConnection(event.channel));
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
        logsy.error(
          '[WebRTCRemoteConnection] onnegotiationneeded - No connection.LocalDescription',
        );

        return;
      }

      // send the offer to the other peer
      this.signalingChannel.negotiateConnection(this.peerId, {
        desc: this.connection.localDescription,
      });
    } catch (error) {
      // TODO: Does this need to be part of logic?
      logsy.error('[WebRTCRemoteConnection] Negotiation Uncaught Error', error);
    }
  }

  private async onSignalingNegotiationMessage(
    msg: SignalingNegotiationMessage,
  ) {
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

    // Here I might need to send an event notifying the outside world that
    // tracks are needed athough, that could happen on demand if the connection
    //  is ready, by adding tracks anytime after?
    // I suppose yes!

    // const localStream = await this.localStream.start({
    //   audio: false,
    //   video: false,
    // });

    // localStream.getTracks().forEach((track) => {
    //   // Send the Stream to the given Peer
    //   this.connection.addTrack(track, localStream);
    // });

    await this.connection.setLocalDescription(
      await this.connection.createAnswer(),
    );

    if (!this.connection.localDescription) {
      logsy.error(
        '[WebRTCRemoteConnection] onSignallingOffer Error - No connection.LocalDescription',
      );

      return;
    }

    this.signalingChannel.negotiateConnection(this.peerId, {
      desc: this.connection.localDescription,
    });
  }

  private async onSignalingAnswer(msg: SignalingMessageWithDescription) {
    await this.connection.setRemoteDescription(msg.desc);
  }

  private async onSignalingCandidate(msg: SignalingMessageWithCandidate) {
    await this.connection.addIceCandidate(msg.candidate);
  }

  // async startAVChannel() {
  //   const localStream = await this.localStream.start({
  //     audio: true,
  //     video: true,
  //   });

  //   localStream.getTracks().forEach((track) => {
  //     this.connection.addTrack(track, localStream);
  //   });
  // }

  openDataChannel() {
    console.log('[RTCClient] Opening Data Channel');

    const dataChannel = getRTCDataXConnection(this.connection.createDataChannel('dataChannel'));

    this.prepareDataChannel(dataChannel);
  }

  closeDataChannel() {
    this.dataChannel?.close();
  }

  private prepareDataChannel(channel: RTCDataX) {
    channel.onopen = () => this.onDataChannelOpen?.(channel);
    channel.onclose = () => this.onDataChannelClose?.();

    // channel.onopen = () => {
    //   this.pubsy.publish('onDataChannelOpen', channel);
    // };

    // channel.onclose = () => {
    //   this.pubsy.publish('onDataChannelClose', null);
    // };

    // publish the dataChannelOpen

    // const onOpenHandler = () => {
    //   console.log('[RTCCilent] Data Channel for', this.peerId, 'opened');
    // };

    // const onClosedHandler = () => {
    //   console.log('[RTCCilent] Data Channel for', this.peerId, 'closed');
    // };

    // const onMessageHandler = (event: MessageEvent) => {
    //   try {
    //     const result = peerMessageEnvelope.decode(JSON.parse(event.data));

    //     if (isLeft(result)) {
    //       logsy.error(
    //         '[WebRTCRemoteConnection][DataChannelMessageHandler] Message Decoding Error',
    //         event.data,
    //       );

    //       return;
    //     }

    //     this.pubsy.publish('onData', result.right);
    //   } catch (e) {
    //     logsy.error(
    //       '[WebRTCRemoteConnection] DataChannelMessageHandler: Message JSON Parsing Error',
    //       event.data,
    //       e,
    //     );
    //   }
    // };

    // channel.addEventListener('open', onOpenHandler);
    // channel.addEventListener('closed', onClosedHandler);
    // channel.addEventListener('message', onMessageHandler);

    // [
    //   () => channel.removeEventListener('open', onOpenHandler),
    //   () => channel.removeEventListener('closed', onClosedHandler),
    //   () => channel.removeEventListener('message', onMessageHandler),
    // ].forEach((fn) => {
    //   this.unsubscribers.dataChannel.push(fn);
    // });

    // this.dataChannel = channel;
  }

  close() {
    this.dataChannel?.close();
    this.connection.close();

    // this.unsubscribeFromAll();
  }

  // onDataChannelOpen = (fn: (channel: RTCDataX) => void) =>
  //   this.pubsy.subscribe('onDataChannelOpen', fn);

  // onDataChannelClose = (fn: () => void) =>
  //   this.pubsy.subscribe('onDataChannelClose', fn);

  // onRemoteStream = (fn: (stream: MediaStream) => void) =>
  //   this.pubsy.subscribe('onRemoteStream', fn);

  // TODO: Do we need onRemoteStreamEnded?

  // private unsubscribeFromAll() {
  //   // Run all the unsubscribers
  //   Object
  //     .values(this.unsubscribers)
  //     .flatMap((arr) => arr)
  //     .forEach((unsubscribe) => unsubscribe());

  //   // And reset them
  //   this.unsubscribers = {
  //     dataChannel: [],
  //   };
  // }


  // Update to onConncted, hmmm - not sure I might still need to notify based on remote streams
  // onRemoteStream = (fn: (p: PeerStream) => void) =>
  //   this.pubsy.subscribe('onRemoteStream', fn);

  // onData = (fn: (msg: PeerMessageEnvelope) => void) =>
  //   this.pubsy.subscribe('onData', fn);

  // sendData(
  //   msg: Pick<PeerMessageEnvelope, 'fromPeerId' | 'message'>,
  // ): Result<
  //   PeerMessageEnvelope,
  //   { type: 'DataChannelNotReady'; peerId: string }
  //   > {
  //   if (!this.dataChannel) {
  //     return new Err({
  //       type: 'DataChannelNotReady',
  //       peerId: this.peerId,
  //     });
  //   }

  //   const msgPayload: PeerMessageEnvelope = {
  //     ...msg,
  //     timestamp: String(new Date().getTime()),
  //     toPeerId: this.peerId,
  //   };

  //   this.dataChannel.send(JSON.stringify(msgPayload));

  //   return new Ok(msgPayload);
  // }
}
