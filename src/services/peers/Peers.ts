import { Pubsy } from 'src/lib/Pubsy';
import { logsy } from 'src/lib/logsy';
import { PeerRecord } from 'dstnd-io';
import { RTCDataX } from 'src/lib/RTCDataX';
import { Err } from 'dstnd-io/dist/ts-results';
import { PeerMessageEnvelope } from './records/PeerMessagingEnvelopePayload';
import { PeerStream, PeerConnectionStatus } from './types';
import { RTCSignalingChannel } from '../socket/RTCSignalingChannel';
import { AVStreaming } from '../AVStreaming';
import { RTCClient } from './RTCClient';
import { PeerMessageHandler } from './PeerMessageHandler';

export class Peers {
  private pubsy = new Pubsy<{
    onRemoteStreamingStart: { peerId: string; stream: MediaStream };
    onRemoteStreamingStop: { peerId: string };
    onPeerMessage: PeerMessageEnvelope;
    onPeerMessageSent: PeerMessageEnvelope;
    onPeerConnectionStatusChange: PeerConnectionStatus;
  }>();

  private localStreamClient: AVStreaming;

  private peerConnections: {
    [id: string]: {
      rtc: RTCClient;
      dataChannel?: PeerMessageHandler;
      // avChannel
    };
  } = {};

  onLocalStreamStart: (fn: (stream: MediaStream) => void) => () => void;

  onLocalStreamStop: (fn: () => void) => () => void;

  unsubscribeFromSignalingChannelOnMessage: () => void;

  constructor(private signalingChannel: RTCSignalingChannel) {
    this.localStreamClient = new AVStreaming();

    this.localStreamClient.onStart(() => {
      logsy.info('LocalStreamClient Started');
    });

    this.localStreamClient.onStop(() => {
      logsy.info('LocalStreamClient Stoped');
    });

    this.onLocalStreamStart = this.localStreamClient.onStart.bind(
      this.localStreamClient,
    );
    this.onLocalStreamStop = this.localStreamClient.onStop.bind(
      this.localStreamClient,
    );

    this.unsubscribeFromSignalingChannelOnMessage = signalingChannel.onMessage((msg) => {
      if (msg.kind === 'webrtcInvitation') {
        // This should be better at this: don't need to recheck the local stram has started
        //  I could in theory just start it now as well preemptively
        // if (this.localStreamClient.hasStarted()) {
        // Accepting the invitation is the default, which means that upon being invited,
        //  The RTC Connection starts the negotation and the streaming
        (async () => {
          console.log('[Peers] invitation received from ', msg.content.peerId);

          const rtc = await this.preparePeerConnection(msg.content.peerId);


          // rtc.startAVChannel();
          // rtc.startDataChannel();
          // this.connect();
        })();
        // }
      }
    });
  }

  /**
   * Send a message to the whole room
   *
   * @param room
   * @param msg
   */
  broadcastMessage(
    peers: PeerRecord[],
    payload: Pick<PeerMessageEnvelope, 'message' | 'fromPeerId'>,
  ) {
    const results = peers
      .map(({ id }) => this.peerConnections[id].dataChannel)
      .map((dataChannel) => dataChannel?.send(payload) ?? new Err(undefined));

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
          peers,
          `Message Payload: ${payload}`,
          `BadResults Count: ${badSends.length} out of ${results.length}`,
          badSends,
          results,
          e,
        );
      });
    }
  }

  // Starts sending and receving streams with EVERY PEER in the room!
  async startAVBroadcasting(peers: PeerRecord[]) {
    await this.localStreamClient.start();

    peers.forEach(async (peer) => {
      await this.preparePeerConnection(peer.id);
      await this.invitePeer(peer.id);
    });
  }

  async startDataChannel(peers: PeerRecord[]) {
    peers.forEach(async (peer) => {
      await this.preparePeerConnection(peer.id);
      await this.invitePeer(peer.id);

      this.peerConnections[peer.id].rtc.openDataChannel();
    });
  }

  stopAVBroadcasting() {
    this.localStreamClient.stop();

    // TODO: Does it need to do anything else here?
  }

  connect(peers: PeerRecord[]) {
    console.log('[Peers] Connecting to', peers.map((p) => p.name));
    peers.forEach(async (peer) => {
      await this.preparePeerConnection(peer.id);
      await this.invitePeer(peer.id);
      console.log('[Peers] Connection to', peer.name, 'ready');

      // To be connected at least the data channel needs to start!
      this.peerConnections[peer.id].rtc.openDataChannel();
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

    const rtc = new RTCClient(
      this.signalingChannel,
      peerId,
    );

    // This should be called onPeerConnected
    // rtc.onRemoteStream((s) => {
    //   this.pubsy.publish('onRemoteStreamingStart', s);
    // });

    // rtc.onRemoteStream =

    // rtc.onData((msg) => {
    //   this.pubsy.publish('onPeerMessage', msg);
    // });

    rtc.connection.onconnectionstatechange = (e) => {
      console.log('[Peers] Connection State to', peerId, 'changed to', e.currentTarget?.connectionState);
    };

    rtc.onDataChannelOpen = (dataChannel: RTCDataX) => {
      const messageHandler = new PeerMessageHandler(dataChannel, peerId);

      // Set the Data Channel
      this.peerConnections[peerId] = {
        ...this.peerConnections[peerId],
        dataChannel: messageHandler,
      };

      this.pubsy.publish('onPeerConnectionStatusChange', {
        peerId,
        isConnected: true,
        channels: {
          data: {
            on: true,
          },
          video: {
            on: false,
          },
          audio: {
            on: false,
          },
        },
      });

      messageHandler.onMesssage = (msg) => {
        this.pubsy.publish('onPeerMessage', msg);
      };
    };

    rtc.onDataChannelClose = () => {
      this.peerConnections[peerId].dataChannel?.releaseListeners();

      // Unset the Data Channel
      this.peerConnections[peerId] = {
        ...this.peerConnections[peerId],
        dataChannel: undefined,
      };
    };

    // rtc.startDataChannel();

    this.peerConnections[peerId] = {
      rtc,
    };

    console.group('[Peers] PeerConnection prepared for', peerId);
    console.log('PeerConnection', this.peerConnections[peerId]);
    console.groupEnd();

    return this.peerConnections[peerId];

    // TODO: Manage dropped/closed connections
  }

  private async invitePeer(peerId: string) {
    this.signalingChannel.send({
      kind: 'webrtcInvitation',
      content: { peerId },
    });

    console.log('[Peers] Invitation sent to', peerId);
  }

  // What is the difference between stop and close??
  close() {
    this.unsubscribeFromSignalingChannelOnMessage();

    this.stopAVBroadcasting();

    // this.localStreamClient.stop();
    // this.socket.close();

    Object.values(this.peerConnections).forEach((conn) => {
      conn.rtc.close();
    });

    // Free them up from the stack
    this.peerConnections = {};
  }

  onPeerConnectionStatusChange = (fn: (p: PeerConnectionStatus) => void) =>
    this.pubsy.subscribe('onPeerConnectionStatusChange', fn);

  onRemoteStreamingStart = (fn: (p: PeerStream) => void) =>
    this.pubsy.subscribe('onRemoteStreamingStart', fn);

  onPeerMessage = (fn: (msg: PeerMessageEnvelope) => void) =>
    this.pubsy.subscribe('onPeerMessage', fn);

  onPeerMessageSent = (fn: (msg: PeerMessageEnvelope) => void) =>
    this.pubsy.subscribe('onPeerMessageSent', fn);
}
