import React, { ReactNode } from 'react';
import { Peer2Peer } from 'src/services/peer2peer';
import { PeerMessage } from 'src/services/peer2peer/records/PeerMessagingPayload';
import { PeerDataRecord } from 'src/modules/GameRoom/records/PeerDataRecord';
import { PeerNetworkRefreshPayload, RoomRecord } from 'dstnd-io';

type RenderProps = {
  start: () => Promise<void>;
  stop: () => void;
  sendPeerData: (msg: PeerDataRecord) => void;
  peerStatus: PeerNetworkRefreshPayload['content'];
  isConnectionReady: boolean;
  localStream?: MediaStream;
  remoteStreams?: {
    [peerId: string]: {
      peerId: string;
      stream: MediaStream;
    };
  };

  // @depreacte in faavor of SRP
  joinRoom: (roomId: string) => void;
};

type Props = {

  // room: RoomRecord;

  renderLoading?: () => ReactNode;
  render: (p: RenderProps) => ReactNode;


  onPeerMsgReceived?: (
    msg: PeerMessage,
    p: Pick<RenderProps, 'sendPeerData' | 'peerStatus'>
  ) => void;
  onPeerMsgSent?: (
    msg: PeerMessage,
    p: Pick<RenderProps, 'sendPeerData' | 'peerStatus'>
  ) => void;
};

type State = {
  isConnectionReady: boolean;
  peerStatus: PeerNetworkRefreshPayload['content'];
  joinedRoom?: RoomRecord;
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

  private unsubscribFromOnReadyStateChange?: () => void;

  private unsubscribeFromOnPeerStatusUpdate?: () => void;

  private unsubscribeFromLocalStreamStart?: () => void;

  private unsubscribeFromLocalStreamStop?: () => void;

  private unsubscribeFromRemoteStreamStart?: () => void;

  state: State = {
    isConnectionReady: false,
    peerStatus: {
      me: '',
      peers: {},
      count: 0,
      all_rooms: {},
      joined_room: null,
    },
    localStream: undefined,
    remoteStreams: undefined,
  };

  componentDidMount() {
    this.p2p = new Peer2Peer();

    this.unsubscribFromOnReadyStateChange = this.p2p.onReadyStateChange(
      (isConnectionReady) => {
        this.setState({ isConnectionReady });
      },
    );

    this.unsubscribeFromOnPeerStatusUpdate = this.p2p.onPeerStatusUpdate(
      (peerStatus) => {
        this.setState((prevState) => ({
          ...prevState,
          peerStatus,
        }));
      },
    );

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
        sendPeerData: (...args) => this.sendPeerData(...args),
        peerStatus: this.state.peerStatus,
      });
    });

    this.p2p.onDataSent((data) => {
      this.props.onPeerMsgSent?.(data, {
        sendPeerData: (...args) => this.sendPeerData(...args),
        peerStatus: this.state.peerStatus,
      });
    });

    // TODO Add local stop
    // TODO Add remote stop
  }

  // TODO: Test the unsubscribes are actually working
  componentWillUnmount() {
    this.p2p?.close();

    this.unsubscribFromOnReadyStateChange?.();
    this.unsubscribeFromOnPeerStatusUpdate?.();
    this.unsubscribeFromLocalStreamStart?.();
    this.unsubscribeFromLocalStreamStop?.();
    this.unsubscribeFromRemoteStreamStart?.();
  }

  private sendPeerData(data: PeerDataRecord) {
    if (!this.state.peerStatus.joined_room) {
      throw new Error(
        'Peer2Peer Error: Cannot sendDAta before joinging a room!',
      );
    }

    this.p2p?.sendDataToRoom(
      this.state.peerStatus.me,
      this.state.peerStatus.joined_room,
      JSON.stringify(data)
    );
  }

  render() {
    if (!this.p2p) {
      return this.props.renderLoading?.() || null;
    }

    return (
      <>
        {this.props.render({
          joinRoom: (roomId) => {
            this.p2p?.joinRoom({
              me: this.state.peerStatus.me,
              roomId,
            });
          },
          start: async () => {
            if (!this.state.peerStatus.joined_room) {
              throw new Error(
                'Peer2Peer Error: Cannot run start before joinging a room!',
              );
            }

            await this.p2p?.startRoomStreaming(
              this.state.peerStatus.me,
              this.state.peerStatus.joined_room
            );
          },
          stop: () => {
            this.p2p?.stop();
          },
          sendPeerData: (data: PeerDataRecord) => this.sendPeerData(data),
          peerStatus: this.state.peerStatus,
          isConnectionReady: this.state.isConnectionReady,

          localStream: this.state.localStream,
          remoteStreams: this.state.remoteStreams,
        })}
      </>
    );
  }
}
