import { useEffect } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { useSocketState } from './useSocketState';

type Props = {
  autoDemandConnection?: boolean;
};

export const useSocketOnMessage = (fn: Parameters<SocketClient['onMessage']>[0], p?: Props) => {
  // Don't Start a Connection Automatically
  const socketState = useSocketState({
    autoDemandConnection: p?.autoDemandConnection || false,
  });

  useEffect(() => {
    if (socketState.status === 'open') {
      const unsubscribe = socketState.socket.onMessage(fn);

      return () => {
        unsubscribe();
      };
    }
  }, [socketState]);
};
