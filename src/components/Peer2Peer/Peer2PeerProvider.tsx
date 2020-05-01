import React, { ReactNode } from 'react';
import { Peer2Peer } from 'src/services/peer2peer';
import {
  PeerNetworkRefreshPayload,
  RoomRecord,
} from 'src/services/peer2peer/records/SignalingPayload';
import { PeerMessage } from 'src/services/peer2peer/records/MessagingPayload';
import { PeerDataRecord } from 'src/modules/GameRoom/peerDataRecord';

type RenderProps = {
  joinRoom: (roomId: string) => void;
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
};

type Props = {
  wssUrl: string;
  iceServersURLs: string[];
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

  // @deprecate in favor of the more explicit above
  // onData?: (msg: PeerMessage, p: Pick<RenderProps, 'sendPeerData' | 'peerStatus'>) => void;
  // onDataSent?: (msg: PeerMessage, p: Pick<RenderProps, 'sendPeerData' | 'peerStatus'>) => void;
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
    // console.log('P2P instantiating');
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
      ({ peerId, stream }) => {
        // console.log('received stream in provider', peerId, remoteStream.id);
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
          () => {
            // console.log('state after stream', this.state);
          },
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
