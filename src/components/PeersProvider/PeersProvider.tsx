import React, { ReactNode } from 'react';
import { PeerRecord } from 'dstnd-io';
import { SocketClient } from 'src/services/socket/SocketClient';
import { RTCSignalingChannel } from 'src/services/socket/RTCSignalingChannel';
import { PeerMessageEnvelope, Peers, PeerConnectionStatus } from 'src/services/peers';

type RenderProps = {
  connect: () => void;

  startAVBroadcasting: () => Promise<void>;
  stopAVBroadcasting: () => void;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
  localStream?: MediaStream;

  peerConnections: {[peerId: string]: PeerConnectionStatus};

  // @Depreacate in favor of peerConnections
  remoteStreams?: {
    [peerId: string]: {
      peerId: string;
      stream: MediaStream;
    };
  };
};

type Props = {
  socket: SocketClient;
  me: PeerRecord;
  peers: PeerRecord[];

  onReady?: (
    p: Omit<RenderProps, 'localStream' | 'remoteStreams'>
  ) => void;

  onPeerConnectionsChanged?: (peerConnections: RenderProps['peerConnections']) => void;

  onPeerMsgReceived?: (
    msg: PeerMessageEnvelope,
    p: Pick<RenderProps, 'broadcastMessage'>
  ) => void;
  onPeerMsgSent?: (
    msg: PeerMessageEnvelope,
    p: Pick<RenderProps, 'broadcastMessage'>
  ) => void;

  render: (p: RenderProps) => ReactNode;
  renderLoading?: () => ReactNode;
};

type State = {

  peerConnections: {[peerId: string]: PeerConnectionStatus};

  // Not sure if the local stream should still be here - probably yes
  localStream?: MediaStream;

  // @depreacate in favor of PeerConnections
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
    peerConnections: [],

    localStream: undefined,
    remoteStreams: undefined,
  };

  componentDidMount() {
    this.peersClient = new Peers(
      new RTCSignalingChannel(this.props.socket.connection),
    );

    this.unsubscribeFromLocalStreamStart = this.peersClient.onLocalStreamStart(
      (localStream) => {
        this.setState((prevState) => ({
          ...prevState,
          localStream,
        }));
      },
    );

    this.unsubscribeFromLocalStreamStop = this.peersClient.onLocalStreamStop(
      () => {
        this.setState((prevState) => ({
          ...prevState,
          localStream: undefined,
        }));
      },
    );

    // @deprecate
    this.unsubscribeFromRemoteStreamStart = this.peersClient.onRemoteStreamingStart(
      ({ peerId, stream }) => {
        this.setState((prevState) => ({
          ...prevState,
          // TODO: Not Sure how to do multiple remote streams
          remoteStreams: {
            ...prevState.remoteStreams,
            [peerId]: {
              peerId,
              stream,
            },
          },
        }));
      },
    );

    this.peersClient.onPeerConnectionStatusChange((peerConnection) => {
      this.setState((prev) => ({
        peerConnections: {
          ...prev.peerConnections,
          [peerConnection.peerId]: peerConnection,
        },
      }), () => {
        // Update the outside world as well
        this.props.onPeerConnectionsChanged?.(this.state.peerConnections);
      });
    });

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

    if (this.props.onReady) {
      this.props.onReady({
        connect: async () => {
          this.peersClient?.connect(this.peersWithoutMe);
        },
        startAVBroadcasting: async () => {
        this.peersClient?.startAVBroadcasting(this.peersWithoutMe);
        },
        stopAVBroadcasting: () => this.peersClient?.stopAVBroadcasting(),
        broadcastMessage: this.broadcastMessage.bind(this),

        peerConnections: this.state.peerConnections,
      });
    }

    // TODO Add local stop
    // TODO Add remote stop
  }

  componentWillUnmount() {
    this.peersClient?.close();

    this.unsubscribeFromLocalStreamStart?.();
    this.unsubscribeFromLocalStreamStop?.();
    this.unsubscribeFromRemoteStreamStart?.();
  }

  private get peersWithoutMe() {
    return this.props.peers.filter((peer) => peer.id !== this.props.me.id);
  }

  private broadcastMessage(message: PeerMessageEnvelope['message']) {
    this.peersClient?.broadcastMessage(this.peersWithoutMe, {
      message,
      fromPeerId: this.props.me.id,
    });
  }

  render() {
    return (
      <>
        {this.props.render({
          connect: async () => {
            this.peersClient?.connect(this.peersWithoutMe);
          },

          startAVBroadcasting: async () => {
            this.peersClient?.startAVBroadcasting(this.peersWithoutMe);
          },
          stopAVBroadcasting: () => this.peersClient?.stopAVBroadcasting(),
          broadcastMessage: this.broadcastMessage.bind(this),

          localStream: this.state.localStream,

          // @deprecate in favor of ConnectedPeers[]
          remoteStreams: this.state.remoteStreams,


          peerConnections: this.state.peerConnections,
        })}
      </>
    );
  }
}
