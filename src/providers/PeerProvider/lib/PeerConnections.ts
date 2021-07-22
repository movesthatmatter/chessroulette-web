import { IceServerRecord, PeerRecord } from 'dstnd-io';
import PeerSDK from 'peerjs';
import { logsy } from 'src/lib/logsy';
import config from 'src/config';
import { wNamespace, woNamespace } from './util';
import { Pubsy } from 'src/lib/Pubsy';
import { ActivePeerConnection } from './ActivePeerConnection';

export type PeerConnectionsErrors = 'PEER_ID_TAKEN' | 'GENERIC_ERROR';

export class PeerConnections {
  private user: PeerRecord['user'];

  private pubsy = new Pubsy<{
    onOpen: void;
    onClose: void;
    onPeerConnected: PeerRecord['id'];
    onPeerDisconnected: PeerRecord['id'];
    onError: PeerConnectionsErrors;
    onPeerStream: {
      peerId: PeerRecord['id'];
      stream: MediaStream;
    };
  }>();

  private sdk: PeerSDK;

  connections: Record<PeerRecord['id'], ActivePeerConnection> = {};

  unsubscribers: (() => void)[] = [];

  constructor({
    user,
    iceServers,
  }: {
    user: PeerRecord['user'];
    iceServers: IceServerRecord[];
  }) {
    this.user = user;

    this.sdk = new PeerSDK(wNamespace(user.id), {
      ...config.SIGNALING_SERVER_CONFIG,
      config: {
        iceServers,
      },
    });

    // On Error Event
    const onErrorHandler = (e: unknown) => {
      // The pattern matching is not the safest since it depends on runtime strings
      //  rather than a type but it's the best we can do atm.
      // TOOD: Need to keep an eye as the library might change it without noticing!
      // TODO: A test should be added around this!
      if (e instanceof Error && e.message.match(/ID "\w+" is taken/g)) {
        this.pubsy.publish('onError', 'PEER_ID_TAKEN');
      } else {
        this.pubsy.publish('onError', 'GENERIC_ERROR');
      }
    };
    this.sdk.on('error', onErrorHandler);

    this.unsubscribers.push(() => this.sdk.off('error', onErrorHandler));

    // On Open Event
    const onOpenHandler = (id: string) => {
      this.pubsy.publish('onOpen', undefined);
    };
    this.sdk.on('open', onOpenHandler);
    this.unsubscribers.push(() => this.sdk.off('open', onOpenHandler));

    // On Connection Event
    const onConnectionHandler = (pc: PeerSDK.DataConnection) => {
      const peerId = woNamespace(pc.peer);

      this.connections[peerId] = new ActivePeerConnection(peerId, pc);

      const unsubscribeFromApcOnClose = this.connections[peerId].onClose(() => {
        this.removePeerConnection(peerId);

        this.pubsy.publish('onPeerDisconnected', peerId);
      });
      this.unsubscribers.push(unsubscribeFromApcOnClose);

      this.pubsy.publish('onPeerConnected', peerId);
    };
    this.sdk.on('connection', onConnectionHandler);
    this.unsubscribers.push(() => this.sdk.off('connection', onConnectionHandler));

    // On Call Event
    const onCallHandler = (call: PeerSDK.MediaConnection) => {
      const peerId = woNamespace(call.peer);
      const apc = this.connections[peerId];

      if (!apc) {
        // This shouldn't happen
        return;
      }

      apc.getMyStream().then((myStream) => {
        call.answer(myStream);
        call.on('stream', (stream) => {
          this.pubsy.publish('onPeerStream', {
            peerId,
            stream,
          });
        });
      });
    };
    this.sdk.on('call', onCallHandler);
    this.unsubscribers.push(() => {
      this.sdk.off('call', onCallHandler);
    });

    // On Close Event
    const onCloseHandler = () => {
      logsy.info('[PeerConnections] PeerSDK Closed.');
      this.pubsy.publish('onClose', undefined);
    };
    this.sdk.on('close', onCloseHandler);
    this.unsubscribers.push(() => this.sdk.off('close', onCloseHandler));

    // On Disconnected Event
    const onDisconnectedHandler = () => {
      logsy.info('[PeerConnections] PeerSDK Disconnected.');
    };
    this.sdk.on('disconnected', onDisconnectedHandler);
    this.unsubscribers.push(() => this.sdk.off('disconnected', onDisconnectedHandler));
  }

  onOpen(fn: () => void) {
    return this.pubsy.subscribe('onOpen', fn);
  }

  onClose(fn: () => void) {
    return this.pubsy.subscribe('onClose', fn);
  }

  onPeerConnected(fn: (peerId: PeerRecord['id']) => void) {
    return this.pubsy.subscribe('onPeerConnected', fn);
  }

  onPeerDisconnected(fn: (peerId: PeerRecord['id']) => void) {
    return this.pubsy.subscribe('onPeerDisconnected', fn);
  }

  onPeerStream(fn: (props: { peerId: string; stream: MediaStream }) => void) {
    return this.pubsy.subscribe('onPeerStream', fn);
  }

  onError(fn: (e: PeerConnectionsErrors) => void) {
    return this.pubsy.subscribe('onError', fn);
  }

  connect(peers: Record<PeerRecord['id'], PeerRecord>) {
    const peersWithoutMe = Object.values(peers)
      // Ensure myPeer is excluded
      .filter(({ id }) => id !== this.user.id);

    const allAPCUnsubscribers = peersWithoutMe.map((peer) => {
      const namespacedPeerId = wNamespace(peer.id);

      const apc = new ActivePeerConnection(peer.id, this.sdk.connect(namespacedPeerId));

      let onStreamUnsubscriber = () => {};
      const onOpenUnsubscriber = apc.onOpen(() => {
        apc.getMyStream().then((stream) => {
          const call = this.sdk.call(namespacedPeerId, stream);

          const onStreamHandler = (stream: MediaStream) => {
            this.pubsy.publish('onPeerStream', {
              peerId: peer.id,
              stream,
            });
          };

          call.on('stream', onStreamHandler);

          onStreamUnsubscriber = () => {
            call.off('stream', onStreamHandler);
          };
        });

        this.pubsy.publish('onPeerConnected', peer.id);
      });

      const onCloseUnsubscriber = apc.onClose(() => {
        this.removePeerConnection(peer.id);

        this.pubsy.publish('onPeerDisconnected', peer.id);
      });

      this.connections[peer.id] = apc;

      return () => {
        // Put all the unsubscribers here
        onStreamUnsubscriber();
        onOpenUnsubscriber();
        onCloseUnsubscriber();
      };
    });

    this.unsubscribers.push(() => {
      allAPCUnsubscribers.forEach((unsubscribe) => {
        unsubscribe();
      });
    });
  }

  removePeerConnection(peerId: PeerRecord['id']) {
    const { [peerId]: apc, ...restConnections } = this.connections;

    if (apc) {
      apc.destroy();

      this.connections = restConnections;
    }
  }

  /**
   * Closes own connection to PeerSDK Server
   */
  close() {
    // Remove all the PeerSDK listeners
    this.unsubscribers.forEach((unsubscribe) => {
      unsubscribe();
    });

    this.unsubscribers = [];

    this.sdk.disconnect();
    this.sdk.destroy();

    logsy.info('[PeerConnections] Closed.');
  }

  /**
   * Destroys all the APCs
   */
  disconnect() {
    Object.values(this.connections).forEach((apc) => {
      apc.destroy();
    });

    this.connections = {};

    logsy.info('[PeerConnections] Disconnected.');
  }

  destroy() {
    this.disconnect();

    this.close();

    logsy.info('[PeerConnections] Destroyed!');
  }
}
