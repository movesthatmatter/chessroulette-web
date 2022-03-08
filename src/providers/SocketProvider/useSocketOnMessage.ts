import { useEffect } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { useSocketState } from './useSocketState';

type Props = {
  autoDemandConnection?: boolean;
};

/* @deprecate
  Note 12/12/2020 Use this for now b/c the useSocketOnMessage hook doesn't // register the
  subscribers correctly! Need to look into that! // What happens is that th useSocketOnMessage
  wouldnt get the messages smoetimes if // I believe it subscribes before the socket opens! 
*/
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
