import { isLeft } from 'fp-ts/lib/Either';
import { forward } from 'src/lib/forward';
import { Pubsy } from 'src/lib/Pubsy';
import { getSocketXConnection, SocketX } from 'src/lib/SocketX';
import { logsy } from 'src/lib/logsy';
import {
  PeerNetworkRefreshPayload,
  RoomRecord,
  socketMessagePayload,
  JoinRoomPayload,
  WebrtcInvitationPayload,
  SocketMessagePayload,
} from 'dstnd-io';
import { WssSignalingChannel } from './WssSignalingChannel';
import { WebRTCRemoteConnection } from './WebRTCRemoteConnection';
import { LocalStreamClient } from './LocalStreamClient';
import { PeerMessage } from './records/PeerMessagingPayload';
import { PeerStream } from './types';

export class Peer2Peer {
  private pubsy = new Pubsy<{
    onReadyStateChange: boolean;
    onPeerStatusUpdate: PeerNetworkRefreshPayload['content'];
    onRemoteStreamingStart: { peerId: string; stream: MediaStream };
    onRemoteStreamingStop: { peerId: string };
    onPeerMessage: PeerMessage;
    onPeerMessageSent: PeerMessage;
  }>();

  private socket: SocketX;

  private localStreamClient: LocalStreamClient;

  private peerConnections: { [id: string]: WebRTCRemoteConnection } = {};

  onLocalStreamStart: (fn: (stream: MediaStream) => void) => () => void;

  onLocalStreamStop: (fn: () => void) => () => void;

  constructor() {
    this.socket = getSocketXConnection();

    this.localStreamClient = new LocalStreamClient();

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

    this.socket.onopen = () => {
      this.pubsy.publish('onReadyStateChange', true);
    };

    this.socket.onclose = () => {
      this.pubsy.publish('onReadyStateChange', false);
    };

    forward<SocketMessagePayload>((fn) => {
      const handler = (event: MessageEvent) => {
        const decoded = socketMessagePayload.decode(JSON.parse(event.data));

        if (isLeft(decoded)) {
          logsy.error(
            '[Peer2Peer]: Socket Message Decoding Error',
            event.data,
          );
          return;
        }

        fn(decoded.right);
      };

      this.socket.addEventListener('message', handler);

      return () => {
        this.socket.removeEventListener('message', handler);
      };
    })((msg) => {
      if (msg.msg_type === 'peer_network_refresh') {
        this.pubsy.publish('onPeerStatusUpdate', msg.content);
      } else if (msg.msg_type === 'webrtc_invitation') {
        // When receiving a webrtc invitation only proceed if the localStreaming is started
        if (this.localStreamClient.hasStarted()) {
          // Accepting the invitation is the default, which means that upon being invited,
          //  The RTC Connection starts the negotation and the streaming
          (async () => {
            const rtc = await this.prepareRTCConnection(msg.content.peer_id);

            rtc.startAVChannel();
            rtc.startDataChannel();
          })();
        }
      }
    });
  }

  async joinRoom(p: { me: string; roomId: string }) {
    const payload: JoinRoomPayload = {
      msg_type: 'join_room',
      content: {
        room_id: p.roomId,
      },
    };

    this.socket.send(JSON.stringify(payload));
  }

  // TODO: This should be called send data to peers
  //  Or, hold the peers and me in here, which I don't agree with
  async sendDataToRoom(me: string, room: RoomRecord, msg: string) {
    const { [me]: removed, ...otherPeers } = room.peers;

    // Invite the all peers to connect
    const results = Object.keys(otherPeers).map((peerId) =>
      this.peerConnections[peerId].sendData({
        fromPeerId: me,
        content: msg,
      }));

    const okSends = results.filter((r) => r.ok);
    const badSends = results.filter((r) => !r.ok);

    if (okSends.length > 0) {
      okSends[0].map((m) => {
        this.pubsy.publish('onPeerMessageSent', m);

        return undefined;
      });
    }

    if (badSends.length > 0) {
      badSends[0].mapErr((e) => {
        // TODO: Do something with these bad sends, like retry or smtg!
        //  It depends on the strategy, but we're not there yet.
        logsy.warn(
          '[Peer2Peer] Received BadResults while Attempting to send Data to Room',
          room,
          `Me: ${me}`,
          `BadResults Count: ${badSends.length} out of ${results.length}`,
          badSends,
          results,
          e,
        );
      });
    }
  }

  // Starts sending and receving streams with EVERY PEER in the room!
  async startRoomStreaming(me: string, room: RoomRecord) {
    await this.localStreamClient.start();

    const { [me]: removed, ...otherPeers } = room.peers;

    // Invite the all peers to connect
    Object.keys(otherPeers).forEach(async (peerId) => {
      await this.prepareRTCConnection(peerId);
      await this.invitePeer(peerId);
    });
  }

  stop() {
    this.localStreamClient.stop();
  }

  private async prepareRTCConnection(peerId: string) {
    if (this.peerConnections[peerId]) {
      logsy.info(
        '[Peer2Peer]prepareRTCConnection: A connection already exists for peer',
        peerId,
      );
      return this.peerConnections[peerId];
    }

    const signal = new WssSignalingChannel(this.socket, peerId);
    const rtc = new WebRTCRemoteConnection(
      signal,
      this.localStreamClient,
      peerId,
    );

    this.peerConnections[peerId] = rtc;

    rtc.onRemoteStream((s) => {
      this.pubsy.publish('onRemoteStreamingStart', s);
    });

    rtc.onData((msg) => {
      this.pubsy.publish('onPeerMessage', msg);
    });

    return this.peerConnections[peerId];

    // TODO: Manage dropped/closed connections
  }

  // The invite is still part of signalling I suppose so it
  //  could be encapsulated in the Signaling Class
  private async invitePeer(peerId: string) {
    const payload: WebrtcInvitationPayload = {
      msg_type: 'webrtc_invitation',
      content: {
        peer_id: peerId,
      },
    };

    this.socket.send(JSON.stringify(payload));
  }

  close() {
    this.localStreamClient.stop();
    this.socket.close();

    Object.values(this.peerConnections).forEach((connection) => {
      connection.close();
    });
  }

  onReadyStateChange = (fn: (ready: boolean) => void) =>
    this.pubsy.subscribe('onReadyStateChange', fn);

  onPeerStatusUpdate = (
    fn: (status: PeerNetworkRefreshPayload['content']) => void,
  ) => this.pubsy.subscribe('onPeerStatusUpdate', fn);

  onRemoteStreamingStart = (fn: (p: PeerStream) => void) =>
    this.pubsy.subscribe('onRemoteStreamingStart', fn);

  onData = (fn: (msg: PeerMessage) => void) =>
    this.pubsy.subscribe('onPeerMessage', fn);

  onDataSent = (fn: (msg: PeerMessage) => void) =>
    this.pubsy.subscribe('onPeerMessageSent', fn);
}
