/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, { createContext, useState, useEffect } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { randomId } from 'src/lib/util';

type Props = {
  wssUrl?: string;
};

export type SocketContextProps = {
  socket: SocketClient | undefined;
  consumers: { [consumerId: string]: null };
  onDemand: () => () => void;
};

export const SocketContext = createContext<SocketContextProps>({
  socket: undefined,
  consumers: {},
  onDemand: () => () => undefined,
});

const HEARTBEAT_INTERVAL = 50 * 1000;

export const SocketProvider: React.FC<Props> = (props) => {
  const [contextState, setContextState] = useState<SocketContextProps>({
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
  });

  useEffect(() => {
    if (!contextState.socket) {
      return undefined;
    }

    const intervalId = setInterval(() => {
        // This is needed because the server(Heroku) closes the connection
        //  if it's idle for 55 seconds
        contextState.socket?.send({
          kind: 'ping',
          content: randomId(),
        });
    }, HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(intervalId);

      // Make sure that the connection closes if the Provider unmounts
      if (contextState.socket?.connection.readyState !== WebSocket.CLOSED) {
          contextState.socket?.close();
      }
    };
  }, [contextState.socket]);

  return (
    <SocketContext.Provider value={contextState}>
      {props.children}
    </SocketContext.Provider>
  );
};
