import { Pubsy } from 'src/lib/Pubsy';
import { logsy } from 'src/lib/logsy';
import { PeerRecord } from 'dstnd-io';
import { PeerMessageEnvelope } from './records/PeerMessagingEnvelopePayload';
import { PeerStream } from './types';
import { RTCSignalingChannel } from '../socket/RTCSignalingChannel';
import { AVStreaming } from '../AVStreaming';
import { RTCClient } from './RTCClient';

export class Peers {
  private pubsy = new Pubsy<{
    onRemoteStreamingStart: { peerId: string; stream: MediaStream };
    onRemoteStreamingStop: { peerId: string };
    onPeerMessage: PeerMessageEnvelope;
    onPeerMessageSent: PeerMessageEnvelope;
  }>();

  private localStreamClient: AVStreaming;

  private peerConnections: { [id: string]: RTCClient } = {};

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
        if (this.localStreamClient.hasStarted()) {
          // Accepting the invitation is the default, which means that upon being invited,
          //  The RTC Connection starts the negotation and the streaming
          (async () => {
            const rtc = await this.preparePeerConnection(msg.content.peerId);

            rtc.startAVChannel();
            rtc.startDataChannel();
          })();
        }
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
    const results = peers.map((peer) => this.peerConnections[peer.id].sendData(payload));

    const okSends = results.filter((r) => r.ok);
    const badSends = results.filter((r) => !r.ok);

    if (okSends.length > 0) {
      okSends[0].map((m) => {
        this.pubsy.publish('onPeerMessageSent', m);
      });
    }

    if (badSends.length > 0) {
      badSends[0].mapErr((e) => {
        // TODO: Do something with these bad sends, like retry or smtg!
        //  It depends on the strategy, but we're not there yet.
        logsy.warn(
          '[Peer2Peer] Received BadResults while Attempting to send Data to Peers',
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

  stopAVBroadcasting() {
    this.localStreamClient.stop();

    // TODO: Does it need to do anything else here?
  }

  private async preparePeerConnection(peerId: string) {
    if (this.peerConnections[peerId]) {
      logsy.info(
        '[Peer2Peer]prepareRTCConnection: A connection already exists for peer',
        peerId,
      );
      return this.peerConnections[peerId];
    }

    const rtc = new RTCClient(
      this.signalingChannel,
      this.localStreamClient,
      peerId,
    );

    // This should be called onPeerConnected
    rtc.onRemoteStream((s) => {
      this.pubsy.publish('onRemoteStreamingStart', s);
    });

    rtc.onData((msg) => {
      this.pubsy.publish('onPeerMessage', msg);
    });

    this.peerConnections[peerId] = rtc;

    return this.peerConnections[peerId];

    // TODO: Manage dropped/closed connections
  }

  private async invitePeer(peerId: string) {
    this.signalingChannel.send({
      kind: 'webrtcInvitation',
      content: { peerId },
    });
  }

  // What is the difference between stop and close??
  close() {
    this.unsubscribeFromSignalingChannelOnMessage();

    this.stopAVBroadcasting();

    // this.localStreamClient.stop();
    // this.socket.close();

    Object.values(this.peerConnections).forEach((connection) => {
      connection.close();
    });

    // Free them up from the stack
    this.peerConnections = {};
  }

  onRemoteStreamingStart = (fn: (p: PeerStream) => void) =>
    this.pubsy.subscribe('onRemoteStreamingStart', fn);

  onPeerMessage = (fn: (msg: PeerMessageEnvelope) => void) =>
    this.pubsy.subscribe('onPeerMessage', fn);

  onPeerMessageSent = (fn: (msg: PeerMessageEnvelope) => void) =>
    this.pubsy.subscribe('onPeerMessageSent', fn);
}
