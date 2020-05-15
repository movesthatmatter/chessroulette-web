import { Pubsy } from 'src/lib/Pubsy';
import { logsy } from 'src/lib/logsy';
import { RTCDataX } from 'src/lib/RTCDataX';
import { Err } from 'dstnd-io/dist/ts-results';
import { DeepPartial } from 'src/lib/types';
import { noop } from 'src/lib/util';
import { PeerMessageEnvelope } from './records/PeerMessagingEnvelopePayload';
import { PeerConnectionStatus } from './types';
import { RTCSignalingChannel } from '../socket/RTCSignalingChannel';
import { AVStreaming } from '../AVStreaming';
import { RTCClient } from './RTCClient';
import { PeerMessageHandler } from './PeerMessageHandler';

type PartialPeerConnectionStatus = {
  peerId: string;
} & DeepPartial<PeerConnectionStatus>;

export class Peers {
  private pubsy = new Pubsy<{
    onPeerConnectionUpdated: PartialPeerConnectionStatus;

    onRemoteStreamingStart: { peerId: string; stream: MediaStream };
    onRemoteStreamingStop: { peerId: string };

    onPeerMessage: PeerMessageEnvelope;
    onPeerMessageSent: PeerMessageEnvelope;
  }>();

  private peerConnections: {
    [id: string]: {
      rtc: RTCClient;
      dataChannel?: PeerMessageHandler;
    };
  } = {};

  unsubscribeFromSignalingChannelOnMessage: () => void;

  constructor(
    private signalingChannel: RTCSignalingChannel,
    private localStreamClient: AVStreaming,
  ) {
    this.unsubscribeFromSignalingChannelOnMessage = signalingChannel.onMessage(
      (msg) => {
        if (msg.kind === 'webrtcInvitation') {
          logsy.log(
            '[Peers] invitation received from ',
            msg.content.peerId,
          );

          this.preparePeerConnection(msg.content.peerId);
        }
      },
    );
  }

  connect(peersIds: string[]) {
    logsy.log('[Peers] Connecting to', peersIds);

    peersIds.forEach(async (peerId) => {
      await this.preparePeerConnection(peerId);
      await this.invitePeer(peerId);

      logsy.log('[Peers] Connection to', peerId, 'ready');

      // To be connected at least the data channel needs be started!
      this.peerConnections[peerId].rtc.openDataChannel();
    });
  }

  private async preparePeerConnection(peerId: string) {
    if (this.peerConnections[peerId]) {
      logsy.info(
        '[Peers] prepareRTCConnection: A connection already exists for peer',
        peerId,
      );
      return this.peerConnections[peerId];
    }

    const rtc = new RTCClient(this.signalingChannel, peerId);

    rtc.connection.onconnectionstatechange = (e) => {
      if (!(e.currentTarget && 'connectionState' in e.currentTarget)) {
        return;
      }

      const { connectionState } = e.currentTarget as any;

      logsy.log('[Peers] Connection State Changed', peerId, connectionState);

      if (connectionState === 'disconnected') {
        this.pubsy.publish('onPeerConnectionUpdated', {
          peerId,
          channels: {
            data: { on: false },
            streaming: { on: false },
          },
        });
      }
    };

    // This is actually when the connection is considerd OPEN
    rtc.onDataChannelOpen = (dataChannel: RTCDataX) => {
      const messageHandler = new PeerMessageHandler(dataChannel, peerId);

      // Set the Data Channel
      this.peerConnections[peerId] = {
        ...this.peerConnections[peerId],
        dataChannel: messageHandler,
      };

      messageHandler.onMesssage = (msg) => {
        this.pubsy.publish('onPeerMessage', msg);
      };

      // Only at this point is the connection considered OPEN!
      this.pubsy.publish('onPeerConnectionUpdated', {
        peerId,
        channels: {
          data: {
            on: true,
          },
          streaming: {
            on: false,
          },
        },
      });

      logsy.log('[Peers] Peer Connection Opened for', peerId);
    };

    // This is actually when the connection is considered CLOSED
    rtc.onDataChannelClose = () => {
      this.peerConnections[peerId].dataChannel?.releaseListeners();

      // Unset the Data Channel
      this.peerConnections[peerId] = {
        ...this.peerConnections[peerId],
        dataChannel: undefined,
      };

      // Unsubscribe from listeners
      unsubscribeFromLocalStreamOnStart();
      unsubscribeFromLocalStreamOnStop();

      logsy.log('[Peers] Peer Connection Closed for', peerId);
    };

    let unsubscribeFromLocalStreamOnStart = noop;

    if (this.localStreamClient.stream) {
      this.streamToPeer(rtc, this.localStreamClient.stream);
    } else {
      // TODO: Listen to constraint changes
      unsubscribeFromLocalStreamOnStart = this.localStreamClient.onStart(
        (stream) => {
          this.streamToPeer(rtc, stream);
        },
      );
    }

    // TODO: Listen to constraint changes
    const unsubscribeFromLocalStreamOnStop = this.localStreamClient.onStop(
      () => {
        // TODO: Make sure this is correct
        rtc.connection.getSenders().forEach((sender) => {
          rtc.connection.removeTrack(sender);
        });

        // TODO: here I need to send a message to the othe peer that the streaming has stopped!
      },
    );

    rtc.onRemoteStream = (stream) => {
      this.pubsy.publish('onPeerConnectionUpdated', {
        peerId,
        channels: {
          streaming: {
            on: true,
            type: 'audio-video',
            stream,
          },
        },
      });
    };

    this.peerConnections[peerId] = {
      rtc,
    };

    return this.peerConnections[peerId];

    // TODO: Manage dropped/closed connections
  }

  private async invitePeer(peerId: string) {
    this.signalingChannel.send({
      kind: 'webrtcInvitation',
      content: { peerId },
    });

    logsy.log('[Peers] Invitation sent to', peerId);
  }

  private streamToPeer(rtc: RTCClient, stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      // Send the Stream to the given Peer
      rtc.connection.addTrack(track, stream);
    });
  }

  /**
   * Send a message to the whole room
   *
   * @param room
   * @param msg
   */
  broadcastMessage(
    payload: Pick<PeerMessageEnvelope, 'message' | 'fromPeerId'>,
  ) {
    const results = Object
      .values(this.peerConnections)
      .map(({ dataChannel }) => dataChannel?.send(payload) ?? new Err(undefined));

    const okSends = results.filter((r) => r);
    const badSends = results.filter((r) => !r);

    if (okSends.length > 0) {
      okSends[0].map((m) => {
        this.pubsy.publish('onPeerMessageSent', m);
      });
    }

    if (badSends.length > 0) {
      badSends[0]?.mapErr((e) => {
        // TODO: Do something with these bad sends, like retry or smtg!
        //  It depends on the strategy, but we're not there yet.
        logsy.warn(
          '[Peers] Received BadResults while Attempting to send Data to Peers',
          Object.keys(this.peerConnections),
          `Message Payload: ${payload}`,
          `BadResults Count: ${badSends.length} out of ${results.length}`,
          badSends,
          results,
          e,
        );
      });
    }
  }

  close() {
    this.unsubscribeFromSignalingChannelOnMessage();

    Object
      .values(this.peerConnections)
      .forEach((conn) => conn.rtc.close());

    // Free them up from the stack
    this.peerConnections = {};
  }

  onPeerConnectionUpdated = (fn: (p: PartialPeerConnectionStatus) => void) =>
    this.pubsy.subscribe('onPeerConnectionUpdated', fn);

  onPeerMessage = (fn: (msg: PeerMessageEnvelope) => void) =>
    this.pubsy.subscribe('onPeerMessage', fn);

  onPeerMessageSent = (fn: (msg: PeerMessageEnvelope) => void) =>
    this.pubsy.subscribe('onPeerMessageSent', fn);
}
