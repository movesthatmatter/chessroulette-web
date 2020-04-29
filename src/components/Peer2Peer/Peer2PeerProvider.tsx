import React, { ReactNode } from 'react';
import { Peer2Peer } from 'src/services/peer2peer';
import {
  PeerNetworkRefreshPayload,
  RoomRecord,
} from 'src/services/peer2peer/records/SignalingPayload';

type Props = {
  wssUrl: string;
  iceServersURLs: string[];
  render: (p: {
    joinRoom: (roomId: string) => void;
    start: () => void;
    stop: () => void;
    peerStatus: PeerNetworkRefreshPayload['content'];
    isConnectionReady: boolean;
    localStream?: MediaStream;
    remoteStreams?: {
      [peerId: string]: {
        peerId: string;
        stream: MediaStream;
      };
    };
  }) => ReactNode;
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
    this.p2p = new Peer2Peer({
      socketUrl: this.props.wssUrl,
      iceServers: [
        {
          urls: this.props.iceServersURLs,
        },
      ],
    });

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

    // Add local stop

    this.unsubscribeFromRemoteStreamStart = this.p2p.onRemoteStreamingStart(
      (peerId, remoteStream) => {
        console.log('received stream in provider', peerId, remoteStream.id);
        this.setState(
          (prevState) => ({
            ...prevState,
            // TODO: Not Sure how to do multiple remote streams
            remoteStreams: {
              ...prevState.remoteStreams,
              [peerId]: {
                peerId,
                stream: remoteStream,
              },
            },
          }),
          () => {
            console.log('state after stream', this.state);
          },
        );
      },
    );

    // Add remote stop
  }

  // TODO: Test this
  componentWillUnmount() {
    this.p2p?.close();
    this.unsubscribFromOnReadyStateChange?.();
    this.unsubscribeFromOnPeerStatusUpdate?.();
    this.unsubscribeFromLocalStreamStart?.();
    this.unsubscribeFromLocalStreamStop?.();
    this.unsubscribeFromRemoteStreamStart?.();
  }

  render() {
    if (!this.p2p) {
      return null;
    }

    return (
      <>
        {this.props.render({
          // p2p: this.p2p,
          joinRoom: (roomId) => {
            // const room = [roomId];

            // console.log('room', room, roomId, this.state.peerStatus.all_rooms);

            // if (Object(this.state.peerStatus.all_rooms).hasOwnProperty(roomId)) {
            //   const room = this.state.peerStatus.all_rooms[roomId];

            // }
            this.p2p?.joinRoom({
              me: this.state.peerStatus.me,
              roomId,
            });
          },
          start: () => {
            if (!this.state.peerStatus.joined_room) {
              throw new Error(
                'Peer2Peer Error: Cannot run start before joinging a room!',
              );
            }

            this.p2p?.startRoomStreaming(
              this.state.peerStatus.me,
              this.state.peerStatus.joined_room
            );
          },
          stop: () => {
            this.p2p?.stop();
          },
          peerStatus: this.state.peerStatus,
          isConnectionReady: this.state.isConnectionReady,

          localStream: this.state.localStream,
          remoteStreams: this.state.remoteStreams,
        })}
      </>
    );
  }
}
