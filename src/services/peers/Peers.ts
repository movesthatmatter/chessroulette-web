/* eslint-disable @typescript-eslint/no-unused-expressions */

import { Pubsy } from 'src/lib/Pubsy';
import { logsy } from 'src/lib/logsy';
import { RTCDataX } from 'src/lib/RTCDataX';
import { Err } from 'ts-results';
import { DeepPartial } from 'src/lib/types';
import { PeerMessageEnvelope } from './records/PeerMessagingEnvelopePayload';
import { PeerConnectionStatus } from './types';
import { RTCSignalingChannel } from '../socket/RTCSignalingChannel';
import { RTCClient } from './RTCClient';
import { PeerMessageHandler } from './PeerMessageHandler';

type PartialPeerConnectionStatus = {
  peerId: string;
} & DeepPartial<PeerConnectionStatus>;

// Depreacted in favor of Peer.js
export class Peers {
  private pubsy = new Pubsy<{
    // TODO @deprecate in favor of the whole onPeerConnectionsUpdated?
    //  So the rtc connections state is only kept in one place
    onPeerConnectionUpdated: PartialPeerConnectionStatus;

    onLocalStreamRequested: {
      resolve(stream: MediaStream): void;
      reject: () => void;
    };

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
    private iceServers: RTCIceServer[],
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

    const rtc = new RTCClient(this.iceServers, this.signalingChannel, peerId);

    rtc.connection.onconnectionstatechange = (e) => {
      if (!(e.currentTarget && 'connectionState' in e.currentTarget)) {
        return;
      }

      const { connectionState } = e.currentTarget as any;

      logsy.log('[Peers] Connection State Changed', peerId, connectionState);

      if (connectionState === 'disconnected') {
        // Remove the bad connection from the state
        const { [peerId]: removed, ...rest } = this.peerConnections;
        this.peerConnections = rest;

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

      logsy.log('[Peers] Peer Connection Closed for', peerId);
    };

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

    // This is a bit more intricate b/c instead of simply publishing an event
    //  and waiting for it's response or not somewhere else, uncoupled
    //  here the logic needs to wait for response from the higher up layers in
    //  the same context (so the stream can be started right away), hence passing
    //  a resolver/rejectior logic right in the event
    rtc.onLocalStreamRequested = () => new Promise((resolve, reject) => {
      this.pubsy.publish('onLocalStreamRequested', { resolve, reject });
    });

    this.peerConnections[peerId] = {
      rtc,
    };

    return this.peerConnections[peerId];
  }

  private async invitePeer(peerId: string) {
    this.signalingChannel.send({
      kind: 'webrtcInvitation',
      content: { peerId },
    });

    logsy.log('[Peers] Invitation sent to', peerId);
  }

  startStreaming(stream: MediaStream) {
    Object
      .keys(this.peerConnections)
      .forEach(async (peerId) => {
        this.peerConnections[peerId].rtc.startStreaming(stream);
      });
  }

  stopStreaming() {
    Object
      .values(this.peerConnections)
      .forEach((pc) => {
        pc.rtc.connection.getSenders().forEach((sender) => {
          pc.rtc.connection.removeTrack(sender);
        });
      });

    // TODO: Is there a difference between the above and
    //  stream.getTracks().forEach((track) => track.stop())
    // Do I need to do both??
  }

  /**
   * Send a message to the whole room
   *
   * @param room
   * @param msg
   */
  broadcastMessage(payload: Pick<PeerMessageEnvelope, 'message' | 'fromPeerId'>) {
    const results = Object
      .values(this.peerConnections)
      .map(({ dataChannel }) => dataChannel?.send(payload) ?? new Err(undefined));

    const okSends = results.filter((r) => r.ok);
    const badSends = results.filter((r) => !r.ok);

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

    // TODO: Update the PeerProvider??
  }

  onPeerConnectionUpdated = (fn: (p: PartialPeerConnectionStatus) => void) =>
    this.pubsy.subscribe('onPeerConnectionUpdated', fn);

  onPeerMessage = (fn: (msg: PeerMessageEnvelope) => void) =>
    this.pubsy.subscribe('onPeerMessage', fn);

  onPeerMessageSent = (fn: (msg: PeerMessageEnvelope) => void) =>
    this.pubsy.subscribe('onPeerMessageSent', fn);

  onLocalStreamRequested = (fn: (msg: {
    resolve: (stream: MediaStream) => void;
    reject: () => void;
  }) => void) => this.pubsy.subscribe('onLocalStreamRequested', fn)
}
