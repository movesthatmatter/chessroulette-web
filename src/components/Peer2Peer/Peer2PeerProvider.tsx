import React, { ReactNode } from 'react';
import { Peer2Peer } from 'src/services/peer2peer';
import { PeerMessage } from 'src/services/peer2peer/records/PeerMessagingPayload';
import { PeerDataRecord } from 'src/modules/GameRoom/records/PeerDataRecord';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import { SocketClient } from 'src/services/socket/SocketClient';
import { RTCSignalingChannel } from 'src/services/socket/RTCSignalingChannel';

type RenderProps = {
  startAVBroadcasting: () => Promise<void>;
  stopAVBroadcasting: () => void;
  broadcastMessage: (msg: PeerDataRecord) => void;
  // peerStatus: PeerNetworkRefreshPayload['content'];
  // isConnectionReady: boolean;
  localStream?: MediaStream;
  remoteStreams?: {
    [peerId: string]: {
      peerId: string;
      stream: MediaStream;
    };
  };
};

type Props = {
  me: PeerRecord;
  room: RoomStatsRecord;
  socket: SocketClient;

  renderLoading?: () => ReactNode;
  render: (p: RenderProps) => ReactNode;

  onPeerMsgReceived?: (
    msg: PeerMessage,
    p: Pick<RenderProps, 'broadcastMessage'>
  ) => void;
  onPeerMsgSent?: (
    msg: PeerMessage,
    p: Pick<RenderProps, 'broadcastMessage'>
  ) => void;
};

type State = {
  isConnectionReady: boolean;
  // peerStatus: PeerNetworkRefreshPayload['content'];
  // joinedRoom?: RoomRecord;
  localStream?: MediaStream;
  remoteStreams?: {
    [peerId: string]: {
      peerId: string;
      stream: MediaStream;
    };
  };
};

export class Peer2PeerProvider extends React.Component<Props, State> {
  private p2p?: Peer2Peer;

  // private unsubscribFromOnReadyStateChange?: () => void;

  // private unsubscribeFromOnPeerStatusUpdate?: () => void;

  private unsubscribeFromLocalStreamStart?: () => void;

  private unsubscribeFromLocalStreamStop?: () => void;

  private unsubscribeFromRemoteStreamStart?: () => void;

  state: State = {
    isConnectionReady: false,
    // peerStatus: {
    //   me: '',
    //   peers: {},
    //   count: 0,
    //   all_rooms: {},
    //   joined_room: null,
    // },
    localStream: undefined,
    remoteStreams: undefined,
  };

  componentDidMount() {
    this.p2p = new Peer2Peer(
      this.props.me,
      new RTCSignalingChannel(this.props.socket.connection),
    );


    // console.log('P2P component did mount', this.p2p);

    // this.unsubscribFromOnReadyStateChange = this.p2p.onReadyStateChange(
    //   (isConnectionReady) => {
    //     this.setState({ isConnectionReady });
    //   },
    // );

    // this.unsubscribeFromOnPeerStatusUpdate = this.p2p.onPeerStatusUpdate(
    //   (peerStatus) => {
    //     this.setState((prevState) => ({
    //       ...prevState,
    //       peerStatus,
    //     }));
    //   },
    // );

    this.unsubscribeFromLocalStreamStart = this.p2p.onLocalStreamStart(
      (localStream) => {
        this.setState((prevState) => ({
          ...prevState,
          localStream,
        }));
      },
    );

    this.unsubscribeFromLocalStreamStop = this.p2p.onLocalStreamStop(() => {
      this.setState((prevState) => ({
        ...prevState,
        localStream: undefined,
      }));
    });


    this.unsubscribeFromRemoteStreamStart = this.p2p.onRemoteStreamingStart(
      ({ peerId, stream }) => {
        this.setState(
          (prevState) => ({
            ...prevState,
            // TODO: Not Sure how to do multiple remote streams
            remoteStreams: {
              ...prevState.remoteStreams,
              [peerId]: {
                peerId,
                stream,
              },
            },
          }),
        );
      },
    );

    this.p2p.onData((data) => {
      this.props.onPeerMsgReceived?.(data, {
        broadcastMessage: (...args) => this.broadcastMessage(...args),
        // peerStatus: this.state.peerStatus,
      });
    });

    this.p2p.onDataSent((data) => {
      this.props.onPeerMsgSent?.(data, {
        broadcastMessage: (...args) => this.broadcastMessage(...args),
        // peerStatus: this.state.peerStatus,
      });
    });

    // TODO Add local stop
    // TODO Add remote stop
  }

  // TODO: Test the unsubscribes are actually working
  componentWillUnmount() {
    this.p2p?.close();

    // this.unsubscribFromOnReadyStateChange?.();
    // this.unsubscribeFromOnPeerStatusUpdate?.();
    this.unsubscribeFromLocalStreamStart?.();
    this.unsubscribeFromLocalStreamStop?.();
    this.unsubscribeFromRemoteStreamStart?.();
  }

  private broadcastMessage(data: PeerDataRecord) {
    this.p2p?.broadcastMessage(
      this.props.room,
      {
        ...data,
        // TODO: Fix this by using the proper names
        msgType: data.msgType === 'chatMessage' ? 'chat' : 'gameData',
      },
    );
  }

  render() {
    // if (!this.p2p) {
    //   return this.props.renderLoading?.() || null;
    // }

    return (
      <>
        {this.props.render({
          startAVBroadcasting: async () => this.p2p?.startAVBroadcasting(this.props.room),
          stopAVBroadcasting: () => this.p2p?.stopAVBroadcasting(),
          broadcastMessage: this.broadcastMessage.bind(this),

          localStream: this.state.localStream,
          remoteStreams: this.state.remoteStreams,
        })}
      </>
    );
  }
}
