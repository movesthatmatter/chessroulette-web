import PubSub from 'pubsub-js';
import {
  SignalingChannel,
  SignalingMessage,
  SignalingMessageWithDescription,
  SignalingMessageWithCandidate,
} from './SignalingChannel';
import { LocalStreamClient } from './LocalStreamClient';

enum PubSubChannels {
  onLocalStream = 'ON_LOCAL_STREAM',
  onRemoteStream = 'ON_REMOTE_STREAM',
}

export class WebRTCRemoteConnection {
  private connection: RTCPeerConnection;

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
    console.log('on track gets called', event);
    PubSub.publish(PubSubChannels.onRemoteStream, {
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
          console.log('Unsupported SDP type.', msg.desc);
        }
      } else if (msg.candidate) {
        this.onSignalingCandidate(msg);
      }
    } catch (err) {
      console.error('Signaling onmessage Error', err);
    }
  }

  private async onSignallingOffer(msg: SignalingMessageWithDescription) {
    console.log('WebRTC.onSignalingOffer', msg);
    await this.connection.setRemoteDescription(msg.desc);

    const localStream = await this.localStream.start();

    localStream.getTracks().forEach((track) => {
      // Send the Stream to the given Peer
      console.log('Sending local stream - peer:', this.peerId, track);
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
    console.log('WebRTC.onSignalingAnswer', msg);
    await this.connection.setRemoteDescription(msg.desc);
  }

  private async onSignalingCandidate(msg: SignalingMessageWithCandidate) {
    console.log('WebRTC.onSignalingCandidate', msg);
    await this.connection.addIceCandidate(msg.candidate);
  }

  async start() {
    const localStream = await this.localStream.start();

    localStream.getTracks().forEach((track) => {
      this.connection.addTrack(track, localStream);
    });
  }

  close() {
    this.connection.close();
  }

  onRemoteStream = (fn: (peerId: string, stream: MediaStream) => void) => {
    const token = PubSub.subscribe(
      PubSubChannels.onRemoteStream,
      (
        _: string,
        { peerId, stream }: { peerId: string; stream: MediaStream },
      ) => fn(peerId, stream),
    );

    // unsubscriber
    return () => {
      PubSub.unsubscribe(token);
    };
  }

  onData = (fn: () => void) => {
    // TODO
  }
}
