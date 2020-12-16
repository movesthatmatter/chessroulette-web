/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, { useState, useEffect } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { randomId } from 'src/lib/util';
import { SocketContext, SocketContextProps } from './SocketContext';

type Props = {
  wssUrl?: string;
};

const HEARTBEAT_INTERVAL = 50 * 1000;

export const SocketProvider: React.FC<Props> = (props) => {
  const initState = {
    socket: undefined,
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
          return {
            ...prev,
            consumers: {
              ...prev.consumers,
              [consumerId]: null,
            },
            socket: new SocketClient(props.wssUrl),
          };
        }

        return {
          ...prev,
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

    // Handle Heartbeats
    const intervalId = setInterval(() => {
      // This is needed because the server(Heroku) closes the connection
      //  if it's idle for 55 seconds
      contextState.socket?.send({
        kind: 'ping',
        content: randomId(),
      });
    }, HEARTBEAT_INTERVAL);

    // Handle Connection Closing
    const unsubscribeFromOnClose = contextState.socket.onClose(() => {
      // Set the ContextState to init if closed
      setContextState(initState);
    });

    return () => {
      clearInterval(intervalId);

      unsubscribeFromOnClose();

      // Make sure that the connection closes if the Provider unmounts
      if (contextState.socket?.connection.readyState !== WebSocket.CLOSED) {
        contextState.socket?.close();
      }
    };
  }, [contextState.socket]);

  return <SocketContext.Provider value={contextState}>{props.children}</SocketContext.Provider>;
};
