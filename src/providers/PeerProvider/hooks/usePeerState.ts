import { SocketPayload } from 'chessroulette-io';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { noop } from 'src/lib/util';
import { SocketReceivableMessage } from 'src/providers/SocketProvider/types';
import { SocketClient } from 'src/services/socket/SocketClient';
import { console } from 'window-or-global';
import { PeerContext } from '../PeerContext';

export const usePeerState = () => useContext(PeerContext);

export const usePeerStateClient = () => {
  const peerState = usePeerState();

  const socketClientRef = useRef<SocketClient>();
  const unsubscribeFromOnMessagefnRef = useRef<() => void>();

  // const onMessageFn = useCallback((fn: (msg: SocketPayload) => unknown) => {
  //   if (!socketClientRef.current) {
  //     return () => {};
  //   }

  //   unsubscribeFromOnMessagefnRef.current = socketClientRef.current.onMessage(fn);
  // }, []);
  // const sendFn: SocketClient['send'] = useCallback((msg) => {
  //   if (!socketClientRef.current) {
  //     return;
  //   }

  //   return socketClientRef.current.send(msg);
  // }, []);

  const defaultClient: Pick<SocketClient, 'send' | 'onMessage'> = useMemo(

    () => ({
      onMessage: (fn: (msg: SocketPayload) => unknown) => {
        // TODO: Here the essages could be relayed

        // unsubscriber
        return noop;
      },
      send: () => {
        console.warn('Send without connection');
      },
    }),
    []
  );

  const [client, setClient] = useState<Pick<SocketClient, 'send' | 'onMessage'>>(defaultClient);

  useEffect(() => {
    if (peerState.status === 'open') {
      setClient({
        onMessage: peerState.client.onMessage.bind(peerState.client),
        send: peerState.client.send.bind(peerState.client),
      });
    } else {
      setClient(defaultClient);
    }
  }, [peerState.status]);

  return client;
};
