import React, { useContext, useEffect, useState } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { noop } from 'src/lib/util';
import { SocketContext } from './SocketContext';
import {
  SocketConnectionStatusNonOpen,
  SocketConnectionStatusOpen,
  SocketReceivableMessage,
} from './types';

export type SocketConsumerProps = {
  autoDemandConnection?: boolean;
  render: (
    renderProps:
      | {
          send: SocketClient['send'];
          close: SocketClient['close'];
          socket: SocketClient;
          status: SocketConnectionStatusOpen;
        }
      | {
          status: SocketConnectionStatusNonOpen;
          open: () => void;
        }
  ) => React.ReactNode;
  onReady?: (socket: SocketClient) => void;
  onMessage?: (msg: SocketReceivableMessage) => void;
  onClose?: () => void;
};

export const SocketConsumer: React.FC<SocketConsumerProps> = ({
  onReady = noop,
  onMessage = noop,
  onClose = noop,
  autoDemandConnection = true,
  ...props
}) => {
  const contextState = useContext(SocketContext);
  const [readyToDemandConnection, setReadyToDemandConnection] = useState(autoDemandConnection);

  useEffect(() => {
    if (contextState.socket) {
      const onOpenHandler = () => {
        if (contextState.socket) {
          onReady(contextState.socket);
        }
      };

      const onCloseHandler = () => {
        onClose();
      };

      // Save the remove fn at this point because if I leave inside the unsubscrier handler
      //  the contextState.socket might not be available anymore!
      const socketListenerRemover = contextState.socket.connection.removeEventListener;

      // If it's already opened when component mounted just send the onReady
      if (contextState.socket.connection.readyState === WebSocket.OPEN) {
        onReady(contextState.socket);
      } else {
        // Otherwise wait for it to open
        contextState.socket.connection.addEventListener('open', onOpenHandler);
      }

      contextState.socket.connection.addEventListener('close', onCloseHandler);

      const unsubscribeOnmessage = contextState.socket.onMessage(onMessage);

      return () => {
        socketListenerRemover('open', onOpenHandler);
        socketListenerRemover('close', onCloseHandler);
        unsubscribeOnmessage();
      };
    }

    return undefined;
  }, [contextState.socket]);

  useEffect(() => {
    if (!readyToDemandConnection) {
      return () => undefined;
    }

    const releaser = contextState.onDemand();

    return () => {
      releaser();
    };
  }, [readyToDemandConnection]);

  return (
    <>
      {props.render(
        contextState.status === 'open'
          ? {
              socket: contextState.socket,
              send: contextState.socket.send.bind(contextState.socket),
              close: contextState.socket.close.bind(contextState.socket),
              status: contextState.status,
            }
          : {
              status: contextState.status,
              open: () => {
                setReadyToDemandConnection(true);
              },
            }
      )}
    </>
  );
};
