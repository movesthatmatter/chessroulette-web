import React, { ReactNode } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { RTCSignalingChannel } from 'src/services/socket/RTCSignalingChannel';
import {
  PeerMessageEnvelope,
  Peers,
  PeerConnectionStatus,
} from 'src/services/peers';
import { logsy } from 'src/lib/logsy';

export type PeerConnections = {
  [peerId: string]: PeerConnectionStatus & { isConnected: boolean };
};

type RenderProps = {
  connect: () => void;
  startStreaming: (stream: MediaStream) => void;
  stopStreaming: () => void;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;

  peerConnections: PeerConnections;
};

type Props = {
  socket: SocketClient;
  meId: string;
  initialPeerIds: string[];

  onReady?: (p: Omit<RenderProps, 'localStream' | 'remoteStreams'>) => void;

  onPeerConnectionsChanged?: (
    peerConnections: RenderProps['peerConnections']
  ) => void;

  onLocalStreamRequested?: () => Promise<MediaStream>;

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
};

export class PeersProvider extends React.Component<Props, State> {
  private peersClient?: Peers;

  private initialPeerIdsWithoutMe: string[];

  private unsubscribers: {[k: string]: () => void} = {};

  state: State = {
    peerConnections: {},
  };

  constructor(props: Props) {
    super(props);

    // Take Me out of the Peers
    this.initialPeerIdsWithoutMe = props.initialPeerIds.filter((peerId) => peerId !== props.meId);
  }

  componentDidMount() {
    this.peersClient = new Peers(new RTCSignalingChannel(this.props.socket.connection));

    this.unsubscribers.onPeerConnectionUpdated = this.peersClient.onPeerConnectionUpdated(
      (status) => {
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
      },
    );

    this.unsubscribers.onLocalStreamRequested = this.peersClient.onLocalStreamRequested(
      async ({ resolve, reject }) => {
        if (!this.props.onLocalStreamRequested) {
          reject();
          return;
        }

        resolve(await this.props.onLocalStreamRequested());
      },
    );

    this.unsubscribers.onPeerMessage = this.peersClient.onPeerMessage((data) => {
      this.props.onPeerMsgReceived?.(data, {
        broadcastMessage: (...args) => this.broadcastMessage(...args),
      });
    });

    this.unsubscribers.onPeerMessageSent = this.peersClient.onPeerMessageSent((data) => {
      this.props.onPeerMsgSent?.(data, {
        broadcastMessage: (...args) => this.broadcastMessage(...args),
      });
    });

    if (this.props.onReady) {
      this.props.onReady({
        connect: async () => this.peersClient?.connect(this.initialPeerIdsWithoutMe),
        startStreaming: (stream) => this.peersClient?.startStreaming(stream),
        stopStreaming: () => this.peersClient?.stopStreaming(),
        broadcastMessage: this.broadcastMessage.bind(this),

        peerConnections: this.state.peerConnections,
      });
    }
  }

  componentWillUnmount() {
    // Unsubscribe from each listener
    Object
      .values(this.unsubscribers)
      .forEach((unsubscribe) => unsubscribe());

    // And only then close the peers client
    this.peersClient?.close();
  }

  private broadcastMessage(message: PeerMessageEnvelope['message']) {
    this.peersClient?.broadcastMessage({
      message,
      fromPeerId: this.props.meId,
    });
  }

  render() {
    return (
      this.props.render({
        connect: async () => this.peersClient?.connect(this.initialPeerIdsWithoutMe),
        startStreaming: (stream) => this.peersClient?.startStreaming(stream),
        stopStreaming: () => this.peersClient?.stopStreaming(),
        broadcastMessage: this.broadcastMessage.bind(this),

        peerConnections: this.state.peerConnections,
      })
    );
  }
}
