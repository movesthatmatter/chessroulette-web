/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { randomId } from 'src/lib/util';
import { SocketContext, SocketContextProps } from './SocketContext';

type Props = {
  wssUrl?: string;
};

export const SocketProvider: React.FC<Props> = (props) => {
  const initState = {
    socket: undefined,
    status: 'init' as const,
    consumers: {},
    onDemand: () => {
      const consumerId = randomId();

      const onRelease = () => {
        // If no other subscribers
        setContextState((prev) => {
          const { [consumerId]: removed, ...rest } = prev.consumers;

          if (Object.keys(rest).length === 0) {
            prev.socket?.close();

            return {
              ...prev,
              consumers: rest,

              // remove the socket after closing
              socket: undefined,
              status: 'disconnected',
            };
          }

          return {
            ...prev,
            consumers: rest,
          };
        });
      };

      setContextState((prev) => {
        if (!prev.socket) {
          const socket = new SocketClient(props.wssUrl);

          return {
            ...prev,
            consumers: {
              ...prev.consumers,
              [consumerId]: null,
            },
            socket,
            // This might not be correct all the time but it's hard(er) and probably useless to keep it in sync with the real statuses
            status: 'open',
          };
        }

        return {
          ...prev,
          // This might not be correct all the time but it's hard(er) and probably useless to keep it in sync with the real statuses
          status: 'open',
          consumers: {
            ...prev.consumers,
            [consumerId]: null,
          },
        };
      });

      return onRelease;
    },
  };

  const [contextState, setContextState] = useState<SocketContextProps>(initState);

  useEffect(() => {
    if (!contextState.socket) {
      return undefined;
    }

    const onOpenEventListener = () => {
      // Set the ContextState to init if closed
      setContextState((prev) => {
        if (prev.socket) {
          return {
            ...prev,
            status: 'open',
          };
        }

        return prev;
      });
    };

    contextState.socket.connection.addEventListener('open', onOpenEventListener);
    const unsubscribeFromOnOpen = () =>
      contextState.socket.connection.removeEventListener('open', onOpenEventListener);

    // Handle Connection Closing
    const unsubscribeFromOnClose = contextState.socket.onClose(() => {
      // Set the ContextState to init if closed
      setContextState({
        ...initState,
        status: 'disconnected',
      });
    });

    return () => {
      unsubscribeFromOnClose();
      unsubscribeFromOnOpen();

      // Make sure that the connection closes if the Provider unmounts
      if (contextState.socket?.connection.readyState !== WebSocket.CLOSED) {
        contextState.socket?.close();
      }
    };
  }, [contextState.socket]);

  return <SocketContext.Provider value={contextState}>{props.children}</SocketContext.Provider>;
};
