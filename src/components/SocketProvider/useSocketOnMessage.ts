import { useContext, useEffect, useState } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { SocketContext } from './SocketContext';
import { useSocketState } from './useSocketState';

type Props = {
  autoDemandConnection?: boolean;
};

export const useSocketOnMessage = (fn: Parameters<SocketClient['onMessage']>[0]) => {
  const socketState = useSocketState();

  useEffect(() => {
    if (socketState.status === 'open') {
      const unsubscribe = socketState.socket.onMessage(fn);

      return () => {
        unsubscribe();
      };
    }
  }, [socketState]);
};
