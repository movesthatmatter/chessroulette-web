import React, { ReactNode } from 'react';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import { SocketClient } from 'src/services/socket/SocketClient';
import { RTCSignalingChannel } from 'src/services/socket/RTCSignalingChannel';
import { PeerMessageEnvelope, Peers } from 'src/services/peers';

type RenderProps = {
  startAVBroadcasting: () => Promise<void>;
  stopAVBroadcasting: () => void;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
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
  room: Pick<RoomStatsRecord, 'peers'>;
  socket: SocketClient;

  renderLoading?: () => ReactNode;
  render: (p: RenderProps) => ReactNode;

  onPeerMsgReceived?: (
    msg: PeerMessageEnvelope,
    p: Pick<RenderProps, 'broadcastMessage'>
  ) => void;
  onPeerMsgSent?: (
    msg: PeerMessageEnvelope,
    p: Pick<RenderProps, 'broadcastMessage'>
  ) => void;
};

type State = {
  localStream?: MediaStream;
  remoteStreams?: {
    [peerId: string]: {
      peerId: string;
      stream: MediaStream;
    };
  };
};

export class PeersProvider extends React.Component<Props, State> {
  private peersClient?: Peers;

  private unsubscribeFromLocalStreamStart?: () => void;

  private unsubscribeFromLocalStreamStop?: () => void;

  private unsubscribeFromRemoteStreamStart?: () => void;

  state: State = {
    localStream: undefined,
    remoteStreams: undefined,
  };

  componentDidMount() {
    this.peersClient = new Peers(new RTCSignalingChannel(this.props.socket.connection));

    this.unsubscribeFromLocalStreamStart = this.peersClient.onLocalStreamStart(
      (localStream) => {
        this.setState((prevState) => ({
          ...prevState,
          localStream,
        }));
      },
    );

    this.unsubscribeFromLocalStreamStop = this.peersClient.onLocalStreamStop(() => {
      this.setState((prevState) => ({
        ...prevState,
        localStream: undefined,
      }));
    });


    this.unsubscribeFromRemoteStreamStart = this.peersClient.onRemoteStreamingStart(
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

    this.peersClient.onPeerMessage((data) => {
      this.props.onPeerMsgReceived?.(data, {
        broadcastMessage: (...args) => this.broadcastMessage(...args),
      });
    });

    this.peersClient.onPeerMessageSent((data) => {
      this.props.onPeerMsgSent?.(data, {
        broadcastMessage: (...args) => this.broadcastMessage(...args),
      });
    });

    // TODO Add local stop
    // TODO Add remote stop
  }

  componentWillUnmount() {
    this.peersClient?.close();

    this.unsubscribeFromLocalStreamStart?.();
    this.unsubscribeFromLocalStreamStop?.();
    this.unsubscribeFromRemoteStreamStart?.();
  }

  private broadcastMessage(message: PeerMessageEnvelope['message']) {
    const roomPeersWithoutMe = Object
      .values(this.props.room.peers)
      .filter((peer) => peer.id !== this.props.me.id);

    this.peersClient?.broadcastMessage(
      roomPeersWithoutMe,
      {
        message,
        fromPeerId: this.props.me.id,
      },
    );
  }

  render() {
    return (
      <>
        {this.props.render({
          startAVBroadcasting: async () => {
            const roomPeersWithoutMe = Object
              .values(this.props.room.peers)
              .filter((peer) => peer.id !== this.props.me.id);

            this.peersClient?.startAVBroadcasting(roomPeersWithoutMe);
          },
          stopAVBroadcasting: () => this.peersClient?.stopAVBroadcasting(),
          broadcastMessage: this.broadcastMessage.bind(this),

          localStream: this.state.localStream,

          // @deprecate in favor of ConnectedPeers[]
          remoteStreams: this.state.remoteStreams,
        })}
      </>
    );
  }
}
