import { IceServerRecord, UserRecord } from 'dstnd-io';
import { Component } from 'react';
import { PeerConnections } from '../lib/PeerConnections';

type Props = {
  iceServers: IceServerRecord[];
  user: UserRecord;

  onOpen?: Parameters<PeerConnections['onOpen']>[0];
  onClose?: Parameters<PeerConnections['onClose']>[0];
  onPeerConnected?: Parameters<PeerConnections['onPeerConnected']>[0];
  onPeerDisconnected?: Parameters<PeerConnections['onPeerDisconnected']>[0];
  onPeerStream?: Parameters<PeerConnections['onPeerStream']>[0];
  onError?: Parameters<PeerConnections['onError']>[0];

  onStateUpdate?: (pcsState: State) => void;
};

export type PeerConnectionsState =
  | {
      status: 'init';
    }
  | {
      status: 'closed';
      destroy: () => void;
      open: (iceServers: IceServerRecord[], user: UserRecord) => void;
    }
  | {
      status: 'ready';
      connected: boolean;
      connectionAttempted: boolean;
      connect: PeerConnections['connect'];
      disconnect: PeerConnections['disconnect'];
      destroy: () => void;
      client: Omit<
        PeerConnections,
        'onOpen' | 'onClose' | 'onPeerConnected' | 'onPeerStream' | 'onError' | 'connect'
      >;
    };

type Unsubscriber = () => void;

type State = PeerConnectionsState;

// The reason this is needed as a class is because it make the state
//  sync up with the various functions that use it much simpler vs an FCM
//  wihch has to use hooks and declare the needed state as a dependency!
//
export class PeerConnectionsHandler extends Component<Props, State> {
  private peerConnections: PeerConnections | undefined;

  private eventListenerUnsubscribers: Unsubscriber[] = [];

  constructor(props: Props) {
    super(props);

    this.state = { status: 'init' };

    this.onStateUpdate();
  }

  componentDidMount() {
    // Open the connnection on mount
    this.open();
  }

  componentWillUnmount() {
    this.eventListenerUnsubscribers.forEach((fn) => fn());

    this.destroy();
  }

  componentDidUpdate(_: Props, prevState: State) {
    // TODO: Make sure this is triggered on flag changes
    if (prevState !== this.state) {
      this.onStateUpdate();
    }
  }

  private onStateUpdate() {
    if (this.props.onStateUpdate) {
      this.props.onStateUpdate(this.state);
    }
  }

  private open() {
    if (this.peerConnections) {
      return;
    }

    this.peerConnections = new PeerConnections({
      iceServers: this.props.iceServers,
      user: this.props.user,
    });

    this.eventListenerUnsubscribers = [
      ...this.eventListenerUnsubscribers,
      this.peerConnections.onOpen(() => {
        if (this.props.onOpen) {
          this.props.onOpen();
        }

        this.setState({
          status: 'ready',
          connected: false,
          client: this.peerConnections,
          connect: this.connect.bind(this),
          disconnect: this.disconnect.bind(this),
          destroy: this.destroy.bind(this),
        });
      }),
      this.peerConnections.onClose(() => {
        if (this.props.onClose) {
          this.props.onClose();
        }

        this.setState({
          status: 'closed',
          open: this.open.bind(this),
          destroy: this.destroy.bind(this),
        });
      }),
      this.peerConnections.onPeerConnected((...args) => {
        if (this.props.onPeerConnected) {
          this.props.onPeerConnected(...args);
        }

        this.setState((prev) => {
          if (!this.peerConnections && prev.status === 'ready') {
            return prev;
          }

          return {
            ...prev,
            connected: true,
          };
        });
      }),
      this.peerConnections.onPeerDisconnected((peerId) => {
        if (this.props.onPeerDisconnected) {
          this.props.onPeerDisconnected(peerId);
        }

        this.setState((prev) => {
          if (!(this.peerConnections && prev.status === 'ready')) {
            return prev;
          }

          return {
            ...prev,
            connected: Object.keys(this.peerConnections.connections).length > 0,
          };
        });
      }),
      this.peerConnections.onPeerStream((...args) => {
        if (this.props.onPeerStream) {
          this.props.onPeerStream(...args);
        }
      }),
      this.peerConnections.onError((...args) => {
        if (this.props.onError) {
          this.props.onError(...args);
        }
      }),
    ];
  }

  private destroy() {
    if (this.peerConnections) {
      this.peerConnections.destroy();
      this.peerConnections = undefined;

      this.setState({
        status: 'closed',
        open: this.open.bind(this),
        destroy: this.destroy.bind(this),
      });
    }
  }

  private connect(peers: Parameters<PeerConnections['connect']>[0]) {
    if (!(this.state.status === 'ready' && this.peerConnections)) {
      return;
    }

    this.peerConnections.connect(peers);

    this.setState((prev) => {
      if (prev.status !== 'ready') {
        return prev;
      }

      return {
        ...prev,
        connectionAttempted: true,
      };
    });
  }

  private disconnect() {
    if (this.peerConnections) {
      this.peerConnections.disconnect();
    }
  }

  render() {
    return null;
  }
}
