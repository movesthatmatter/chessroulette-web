import React, { ReactNode } from 'react';
import { PeerRecord } from 'dstnd-io';
import { SocketClient } from 'src/services/socket/SocketClient';
import { RTCSignalingChannel } from 'src/services/socket/RTCSignalingChannel';
import {
  PeerMessageEnvelope,
  Peers,
  PeerConnectionStatus,
} from 'src/services/peers';
import { logsy } from 'src/lib/logsy';
import { AVStreaming } from 'src/services/AVStreaming';

type PeerConnections = {
  [peerId: string]: PeerConnectionStatus & { isConnected: boolean };
};

type RenderProps = {
  connect: () => void;

  startAVBroadcasting: () => void;
  stopAVBroadcasting: () => void;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;

  localStream?: MediaStream;
  peerConnections: PeerConnections;
};

type Props = {
  socket: SocketClient;
  me: PeerRecord;
  peers: PeerRecord[];

  onReady?: (p: Omit<RenderProps, 'localStream' | 'remoteStreams'>) => void;

  onPeerConnectionsChanged?: (
    peerConnections: RenderProps['peerConnections']
  ) => void;

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
  peerConnections: PeerConnections;
  localStream?: MediaStream;
};

export class PeersProvider extends React.Component<Props, State> {
  private peersClient?: Peers;

  private localStreamClient?: AVStreaming;

  private unsubscribeFromLocalStreamStart?: () => void;

  private unsubscribeFromLocalStreamStop?: () => void;

  private unsubscribeFromRemoteStreamStart?: () => void;

  state: State = {
    peerConnections: {},
    localStream: undefined,
  };

  componentDidMount() {
    this.localStreamClient = new AVStreaming();
    this.peersClient = new Peers(
      new RTCSignalingChannel(this.props.socket.connection),
      this.localStreamClient,
    );

    this.unsubscribeFromLocalStreamStart = this.localStreamClient.onStart(
      (localStream) => {
        this.setState((prevState) => ({
          ...prevState,
          localStream,
        }));
      },
    );

    this.unsubscribeFromLocalStreamStop = this.localStreamClient.onStop(
      () => {
        this.setState((prevState) => ({
          ...prevState,
          localStream: undefined,
        }));
      },
    );

    this.peersClient.onPeerConnectionUpdated((status) => {
      logsy.log('[PeersProvider] onPeerConnectionUpdated', status);

      this.setState(
        (prev) => {
          const defaultChannels: PeerConnectionStatus['channels'] = {
            data: {
              on: false,
            },
            streaming: {
              on: false,
            },
          } as const;

          const prevChannels = prev.peerConnections[status.peerId]?.channels ?? {};
          const nextChannels = status.channels || {};

          const nextPeerConnectionStateChannels = Object.assign(
            defaultChannels,
            prevChannels,
            nextChannels,
          );

          const nextPeerConnection = {
            peerId: status.peerId,
            channels: nextPeerConnectionStateChannels,
            isConnected: Object
              .values(nextPeerConnectionStateChannels)
              .filter((p) => p.on)
              .length > 0,
          };

          if (nextPeerConnection.isConnected) {
            return {
              peerConnections: {
                ...prev.peerConnections,
                [status.peerId]: nextPeerConnection,
              },
            };
          }

          const { [status.peerId]: removed, ...rest } = prev.peerConnections;

          return {
            peerConnections: rest,
          };
        },
        () => {
          this.props.onPeerConnectionsChanged?.(this.state.peerConnections);
        },
      );
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
        startAVBroadcasting: () => this.startAVBroadcasting(),
        stopAVBroadcasting: () => this.stopAVBroadcasting(),
        broadcastMessage: this.broadcastMessage.bind(this),

        peerConnections: this.state.peerConnections,
      });
    }
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

  private startAVBroadcasting() {
    this.localStreamClient?.start();
  }

  private stopAVBroadcasting() {
    this.localStreamClient?.stop();
  }

  render() {
    return (
      <>
        {this.props.render({
          connect: async () => {
            this.peersClient?.connect(this.peersWithoutMe);
          },

          startAVBroadcasting: () => this.startAVBroadcasting(),
          stopAVBroadcasting: () => this.stopAVBroadcasting(),
          broadcastMessage: this.broadcastMessage.bind(this),

          localStream: this.state.localStream,
          peerConnections: this.state.peerConnections,
        })}
      </>
    );
  }
}
