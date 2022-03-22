import React from 'react';
import { IceServerRecord, PeerRecord, UserRecord } from 'dstnd-io';
import { PeerConnectionsContext, PeerConnectionsContextState } from './PeerConnectionsContext';
import {
  PeerConnectionsHandler,
  PeerConnectionsState,
  PeerConnectionsStateProps,
} from './PeerConnectionsHandler';
import { Peer, PeersMap } from '../PeerProvider';
import { getIceURLS } from './resources';
import { PeerConnectionsErrors } from './PeerConnections';

type Props = {
  user: UserRecord;
  uniqId: string; // Make sure this changes each time is need (i.e. when the room changes)

  onOpen?: PeerConnectionsStateProps['onOpen'];
  onPeerConnected?: PeerConnectionsStateProps['onPeerConnected'];
  onPeerStream?: PeerConnectionsStateProps['onPeerStream'];
  onPeerDisconnected?: PeerConnectionsStateProps['onPeerDisconnected'];
  onClose?: PeerConnectionsStateProps['onClose'];
  onError?: PeerConnectionsStateProps['onError'];

  onPeerConnectionChannelsUpdated?: (p: {
    peerId: Peer['id'];
    channels: Partial<Peer['connection']['channels']>;
  }) => void;
};

type State = {
  peerConnectionsState: PeerConnectionsState;
  contextState: PeerConnectionsContextState;
  iceServers: IceServerRecord[] | undefined;
};

export class PeerToPeerProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      peerConnectionsState: { status: 'init' },
      contextState: { ready: false },
      iceServers: undefined,
    };

    this.connectToPeers = this.connectToPeers.bind(this);
    this.disconnectFromAllPeers = this.disconnectFromAllPeers.bind(this);

    // Peer Connection Handlers
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onError = this.onError.bind(this);
    this.onPeerConnected = this.onPeerConnected.bind(this);
    this.onPeerStream = this.onPeerStream.bind(this);
    this.onPeerDisconnected = this.onPeerDisconnected.bind(this);

    // Other
    this.onStateUpdated = this.onStateUpdated.bind(this);
  }

  componentDidMount() {
    // TODO: This could be cached localy
    getIceURLS().map((iceServers) => {
      this.setState({ iceServers });
    });
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (!(prevState.peerConnectionsState === this.state.peerConnectionsState)) {
      this.setState({ contextState: this.getNextContextState(prevState.contextState) });
    }
  }

  private getNextContextState(prev: State['contextState']): PeerConnectionsContextState {
    if (this.state.peerConnectionsState.status === 'ready') {
      return {
        ready: true,
        client: this.state.peerConnectionsState.client,
        connectToPeers: this.connectToPeers,
        disconnectFromAllPeers: this.disconnectFromAllPeers,
        connectionAttempted: this.state.peerConnectionsState.connectionAttempted,
      };
    }

    return {
      ready: false,
    };
  }

  private connectToPeers(peers: PeersMap) {
    // TODO: Ensure the "connectionAttempted" works here, and it resets each time there is a new room
    if (
      this.state.peerConnectionsState.status === 'ready' &&
      !this.state.peerConnectionsState.connectionAttempted
    ) {
      this.state.peerConnectionsState.connect(peers);
    }
  }

  private disconnectFromAllPeers() {
    if (this.state.peerConnectionsState.status === 'ready') {
      this.state.peerConnectionsState.disconnect();
    }
  }

  private onOpen = () => {
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  };

  private onClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  private onError = (e: PeerConnectionsErrors) => {
    if (this.props.onError) {
      this.props.onError(e);
    }
  };

  private onPeerConnected = (peerId: PeerRecord['id']) => {
    if (this.props.onPeerConnected) {
      this.props.onPeerConnected(peerId);
    }

    if (this.props.onPeerConnectionChannelsUpdated) {
      this.props.onPeerConnectionChannelsUpdated({
        peerId,
        channels: {
          data: { on: true }, // TODO: Should this be updated from here as well?
        },
      });
    }
  };

  private onPeerStream = (props: { peerId: string; stream: MediaStream }) => {
    if (this.props.onPeerStream) {
      this.props.onPeerStream(props);
    }

    if (this.props.onPeerConnectionChannelsUpdated) {
      this.props.onPeerConnectionChannelsUpdated({
        peerId: props.peerId,
        channels: {
          data: { on: true }, // TODO: Should this be updated from here as well?
          streaming: {
            on: true,
            stream: props.stream,
            type: 'audio-video',
          },
        },
      });
    }
  };

  private onPeerDisconnected = (peerId: PeerRecord['id']) => {
    if (this.props.onPeerDisconnected) {
      this.props.onPeerDisconnected(peerId);
    }

    if (this.props.onPeerConnectionChannelsUpdated) {
      this.props.onPeerConnectionChannelsUpdated({
        peerId,
        channels: {
          data: { on: false },
          streaming: { on: false },
        },
      });
    }
  };

  private onStateUpdated = (nextPeerConnectionsState: PeerConnectionsState) => {
    this.setState({ peerConnectionsState: nextPeerConnectionsState });
  };

  render() {
    return (
      <>
        {this.state.iceServers && (
          <PeerConnectionsHandler
            // Reset this once the id changes
            key={this.props.uniqId}
            iceServers={this.state.iceServers}
            user={this.props.user}
            onPeerConnected={this.onPeerConnected}
            onClose={this.onClose}
            onOpen={this.onOpen}
            onError={this.onError}
            onPeerDisconnected={this.onPeerDisconnected}
            onPeerStream={this.onPeerStream}
            onStateUpdate={this.onStateUpdated}
          />
        )}
        <PeerConnectionsContext.Provider value={this.state.contextState}>
          {this.props.children}
        </PeerConnectionsContext.Provider>
      </>
    );
  }
}
