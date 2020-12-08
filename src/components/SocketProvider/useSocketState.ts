import { useContext, useEffect, useState } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { SocketContext } from './SocketContext';

type Props = {
  autoDemandConnection?: boolean;
};

type SocketState =
  | {
      status: 'init';
    }
  | {
      status: 'connecting';
    }
  | {
      status: 'open';
      socket: SocketClient;
    }
  | {
      status: 'closed';
    };

export const useSocketState = ({ autoDemandConnection = true }: Props = {}): SocketState => {
  const contextState = useContext(SocketContext);
  const [socketState, setSocketState] = useState<SocketState>({ status: 'init' });

  useEffect(() => {
    if (contextState.socket) {
      setSocketState({
        status:
          contextState.socket.connection.readyState === WebSocket.CONNECTING
            ? 'connecting'
            : 'open',
        socket: contextState.socket,
      });
    } else {
      setSocketState({ status: 'closed' });
    }
  }, [contextState.socket, contextState.socket?.connection.readyState]);

  useEffect(() => {
    if (!autoDemandConnection) {
      return () => undefined;
    }

    const releaser = contextState.onDemand();

    return () => {
      releaser();
    };
  }, [autoDemandConnection]);

  return socketState;
};
