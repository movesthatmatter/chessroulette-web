import { IceServerRecord, UserRecord } from 'dstnd-io';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PeerConnections } from './PeerConnections';

type State =
  | {
      status: 'closed';
      destroy: () => void;
    }
  | {
      status: 'open';
      connected: boolean;
      connect: PeerConnections['connect'];
      disconnect: PeerConnections['disconnect'];
      destroy: () => void;
      client: Omit<
        PeerConnections,
        'onOpen' | 'onClose' | 'onPeerConnected' | 'onPeerStream' | 'onError' | 'connect'
      >;
    };

export const usePeerConnections = (
  iceServers?: IceServerRecord[],
  user?: UserRecord,
  eventListeners: {
    onOpen?: Parameters<PeerConnections['onOpen']>[0];
    onClose?: Parameters<PeerConnections['onClose']>[0];
    onPeerConnected?: Parameters<PeerConnections['onPeerConnected']>[0];
    onPeerDisconnected?: Parameters<PeerConnections['onPeerDisconnected']>[0];
    onPeerStream?: Parameters<PeerConnections['onPeerStream']>[0];
    onError?: Parameters<PeerConnections['onError']>[0];
  } = {}
) => {
  const instance = useRef<PeerConnections>();
  const [hasInstance, setHasInstance] = useState(false);

  const destroy = useCallback(() => {
    if (instance.current) {
      instance.current.destroy();
      instance.current = undefined;
      setHasInstance(false);
    }
  }, [instance.current]);

  const disconnect = useCallback(() => {
    if (instance.current) {
      instance.current.disconnect();
    }
  }, [instance.current]);

  const connect = useCallback(
    (peers: Parameters<PeerConnections['connect']>[0]) => {
      if (!instance.current) {
        return;
      }

      instance.current.connect(peers);
    },
    [instance.current]
  );

  const [state, setState] = useState<State>({ 
    status: 'closed',
    destroy,
  });

  useEffect(() => {
    if (!(iceServers && user)) {
      // If there was a previous instance but now the iceServers or user
      // have gone missing just destroy it
      if (instance.current) {
        instance.current.destroy();
        instance.current = undefined;
        setHasInstance(false);
        return;
      }

      return;
    }

    if (instance.current) {
      return;
    }

    instance.current = new PeerConnections({ iceServers, user });

    setHasInstance(true);
  }, [iceServers, user, eventListeners, state]);

  useEffect(() => {
    if (!instance.current) {
      return;
    }

    const unsubscribers = [
      instance.current.onOpen(() => {
        if (eventListeners.onOpen) {
          eventListeners.onOpen();
        }

        setState((prev) => {
          // console.log('[usePeerConnections] on Open ATTEMPT to set state', instance.current);
          if (!instance.current) {
            return prev;
          }

          const nextState: State = {
            status: 'open',
            connected: false,
            client: instance.current,
            connect,
            disconnect,
            destroy,
          };

          return nextState;
        });
      }),
      instance.current.onClose(() => {
        if (eventListeners.onClose) {
          eventListeners.onClose();
        }

        setState({ status: 'closed', destroy });
      }),
      instance.current.onPeerConnected((...args) => {
        if (eventListeners.onPeerConnected) {
          eventListeners.onPeerConnected(...args);
        }

        setState((prev) => {
          if (!instance.current && prev.status === 'open') {
            return prev;
          }

          return {
            ...prev,
            connected: true,
          };
        });
      }),
      instance.current.onPeerDisconnected((peerId) => {
        if (eventListeners.onPeerDisconnected) {
          eventListeners.onPeerDisconnected(peerId);
        }

        setState((prev) => {
          if (!(instance.current && prev.status === 'open')) {
            return prev;
          }

          return {
            ...prev,
            connected: Object.keys(instance.current.connections).length > 0,
          };
        })
      }),
      instance.current.onPeerStream((...args) => {
        if (eventListeners.onPeerStream) {
          eventListeners.onPeerStream(...args);
        }
      }),
      instance.current.onError((...args) => {
        if (eventListeners.onError) {
          eventListeners.onError(...args);
        }
      }),
    ];
    return () => {
      unsubscribers.forEach((fn) => fn());
    };
  }, [hasInstance, connect]);

  useEffect(() => {
    return () => {
      if (instance.current) {
        instance.current.destroy();
        instance.current = undefined;
        setHasInstance(false);
      }
    };
  }, []);

  return state;
};
