import PubSub from 'pubsub-js';
import { isLeft } from 'fp-ts/lib/Either';
import { WssSignalingChannel } from './WssSignalingChannel';
import {
  PeerNetworkRefreshPayload,
  PeerJoinedRoomPayload,
  RoomRecord,
  socketMessagePayload,
  JoinRoomPayload,
  WebrtcInvitationPayload,
} from './records/SignalingPayload';
import { WebRTCRemoteConnection } from './WebRTCRemoteConnection';
import { LocalStreamClient } from './LocalStreamClient';

enum PubSubChannels {
  onReadyStateChange = 'ON_READY_STATE_CHANGE',
  onPeerStatusUpdate = 'ON_PEER_STATUS_UPDATE',
  onRemoteStreamingStart = 'ON_REMOTE_STARTING_START',
  onRemoteStreamingStop = 'ON_REMOTE_STARTING_STOP',
}

export class Peer2Peer {
  private socket: WebSocket;

  private localStreamClient: LocalStreamClient;

  private peerConnections: { [id: string]: WebRTCRemoteConnection } = {};

  onLocalStreamStart: (fn: (stream: MediaStream) => void) => () => void;

  onLocalStreamStop: (fn: () => void) => () => void;
  // onData: typeof WebRTCClient.prototype.onData;

  constructor(
    private config: {
      socketUrl: string;
      iceServers: RTCIceServer[];
    },
  ) {
    console.log('Peer 2 peer constructor', config);
    console.log('WebSocket', WebSocket);

    this.socket = new WebSocket(config.socketUrl);

    console.log('socket', this.socket);
    this.localStreamClient = new LocalStreamClient();

    this.onLocalStreamStart = this.localStreamClient.onStart.bind(
      this.localStreamClient,
    );
    this.onLocalStreamStop = this.localStreamClient.onStop.bind(
      this.localStreamClient,
    );

    this.socket.onopen = () => {
      PubSub.publish(PubSubChannels.onReadyStateChange, true);
    };

    this.socket.onclose = () => {
      PubSub.publish(PubSubChannels.onReadyStateChange, false);
    };

    this.socket.addEventListener('message', (event) => {
      const decoded = socketMessagePayload.decode(JSON.parse(event.data));

      if (isLeft(decoded)) {
        console.warn(
          'Peer2Peer:message received a non standard payload',
          event.data,
        );
        return;
      }

      const msg = decoded.right;

      if (msg.msg_type === 'peer_network_refresh') {
        this.onPeerNetworkRefresh(msg.content);
      } else if (msg.msg_type === 'peer_joined_room') {
        this.onPeerJoinedRoom(msg.content);
      } else if (msg.msg_type === 'webrtc_invitation') {
        // When receiving a webrtc invitation only proceed if the localStreaming is started
        if (this.localStreamClient.hasStarted()) {
          // Accepting the invitation is the default, which means that upon being invited,
          //  The RTC Connection starts the negotation and the streaming
          (async () => {
            const rtc = await this.prepareRTCConnection(msg.content.peer_id);

            rtc.start();

            console.log(
              'STEP - webrtc_invitation received from',
              msg.content.peer_id,
              this.peerConnections,
            );
            // connection.start();
          })();
        }
      }
    });
  }

  private onPeerNetworkRefresh(status: PeerNetworkRefreshPayload['content']) {
    console.log('Peer2Peer.onPeerNetworkRefresh', status);

    PubSub.publish(PubSubChannels.onPeerStatusUpdate, status);
  }

  async joinRoom(p: { me: string; roomId: string }) {
    const payload: JoinRoomPayload = {
      msg_type: 'join_room',
      content: {
        room_id: p.roomId,
      },
    };

    this.socket.send(JSON.stringify(payload));

    console.log('STEP - joinRoom', this.peerConnections);

    // this.startRoomStreaming(me, room);
  }

  // TBD - deprecate as not needed anymore?
  private async onPeerJoinedRoom(msg: PeerJoinedRoomPayload['content']) {
    // This will be replaced by a peer_call message, which is more specific
    //  and can be made at joining the room, at start time or at any other moment
    console.log('Peer2Peer.onPeerJoinedRoom', msg);
  }

  private onPeerLeftRoom() {
    // TBD
  }

  // Starts sending and receving streams with EVERY PEER in the room!
  async startRoomStreaming(me: string, room: RoomRecord) {
    console.log('Peer2Peer.startRoomStreaming', room);

    await this.localStreamClient.start();

    console.log(
      'STEP - Start Room Streaming (local stream)',
      this.peerConnections,
    );

    const { [me]: removed, ...otherPeers } = room.peers;

    // Invite the all peers to connect
    Object.keys(otherPeers).forEach(async (peerId) => {
      await this.prepareRTCConnection(peerId);
      await this.invitePeer(peerId);
    });
  }

  stop() {
    this.localStreamClient.stop();

    // TODO: Add remote stoppers
  }

  private async prepareRTCConnection(peerId: string) {
    if (this.peerConnections[peerId]) {
      console.warn(
        'Peer2Peer.prepareRTCConnection: A connection already exists for peer',
        peerId,
      );
      return this.peerConnections[peerId];
    }

    const signal = new WssSignalingChannel(this.socket, peerId);
    const rtc = new WebRTCRemoteConnection(
      this.config.iceServers,
      signal,
      this.localStreamClient,
      peerId,
    );

    this.peerConnections[peerId] = rtc;

    rtc.onRemoteStream((_, stream) => {
      console.log('received remote stream', peerId, stream);

      PubSub.publish(PubSubChannels.onRemoteStreamingStart, { peerId, stream });
    });

    console.log('STEP - Prepare TRC Connection', peerId, this.peerConnections);

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

    console.log('STEP - Invite Peer', peerId, this.peerConnections);

    this.socket.send(JSON.stringify(payload));
  }

  close() {
    // TBD - closing all of them or just 1
  }

  onReadyStateChange(fn: (ready: boolean) => void) {
    const token = PubSub.subscribe(
      PubSubChannels.onReadyStateChange,
      (_: string, value: boolean) => fn(value),
    );

    // unsubscribe
    return () => {
      PubSub.unsubscribe(token);
    };
  }

  onPeerStatusUpdate(
    fn: (status: PeerNetworkRefreshPayload['content']) => void,
  ) {
    const token = PubSub.subscribe(
      PubSubChannels.onPeerStatusUpdate,
      (_: string, value: PeerNetworkRefreshPayload['content']) => fn(value),
    );

    return () => {
      PubSub.unsubscribe(token);
    };
  }

  onRemoteStreamingStart(fn: (peerId: string, stream: MediaStream) => void) {
    const token = PubSub.subscribe(
      PubSubChannels.onRemoteStreamingStart,
      (
        _: string,
        { peerId, stream }: { peerId: string; stream: MediaStream },
      ) => fn(peerId, stream),
    );

    return () => {
      PubSub.unsubscribe(token);
    };
  }
}
