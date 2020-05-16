/* eslint-disable no-param-reassign */
import { getRTCDataXConnection, RTCDataX } from 'src/lib/RTCDataX';
import { logsy } from 'src/lib/logsy';
import config from 'src/config';
import {
  RTCSignalingChannel,
  SignalingNegotiationMessage,
  SignalingMessageWithDescription,
  SignalingMessageWithCandidate,
} from '../socket/RTCSignalingChannel';

export class RTCClient {
  public connection: RTCPeerConnection;

  public onDataChannelOpen?: (channel: RTCDataX) => void;

  public onDataChannelClose?: () => void;

  public onLocalStreamRequested?: () => Promise<MediaStream>;

  public onRemoteStream?: (stream: MediaStream) => void;

  private dataChannel?: RTCDataX;

  private unsubscribeFromSignalingOnMessageType: Function;

  constructor(
    private signalingChannel: RTCSignalingChannel,
    private peerId: string,
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

    this.unsubscribeFromSignalingOnMessageType = this.signalingChannel.onMessageType(
      'negotiation',
      (msg) => {
        if (msg.content.peerId === this.peerId) {
          this.onSignalingNegotiationMessage(
            msg.content.forward as SignalingNegotiationMessage,
          );
        }
      },
    );

    // Audio Video
    this.connection.ontrack = (event) => {
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

    // Once the offer was made by remote peer and set as description
    //  It's time to send over the local stream (if available).
    // This could be unanswered by the Me which shouldn't stop the connection
    //  but it should wait for it
    if (this.onLocalStreamRequested) {
      this.startStreaming(await this.onLocalStreamRequested());
    }

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

  startStreaming(stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      this.connection.addTrack(track, stream);
    });
  }

  openDataChannel() {
    logsy.log('[RTCClient] Opening Data Channel');

    const dataChannel = getRTCDataXConnection(
      this.connection.createDataChannel('dataChannel'),
    );

    this.prepareDataChannel(dataChannel);
  }

  closeDataChannel() {
    this.dataChannel?.close();
  }

  private prepareDataChannel(channel: RTCDataX) {
    channel.onopen = () => this.onDataChannelOpen?.(channel);
    channel.onclose = () => this.onDataChannelClose?.();
  }

  close() {
    this.unsubscribeFromSignalingOnMessageType();

    this.dataChannel?.close();
    this.connection.close();
  }
}
