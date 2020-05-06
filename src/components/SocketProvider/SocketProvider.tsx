import React, { createContext, useState } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';

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

export const SocketProvider: React.FC<Props> = (props) => {
  const [contextState, setContextState] = useState<SocketContextProps>({
    socket: undefined,
    consumers: {},
    onDemand: () => {
      const consumerId = String(Math.random()).slice(2);

      const onRelease = () => {
        const { [consumerId]: removed, ...rest } = contextState.consumers;

        // If no other subscribers
        if (Object.keys(rest).length === 0) {
          setContextState((prev) => {
            prev.socket?.close();

            return {
              ...prev,
              consumers: rest,

              // remove the socket after closing
              socket: undefined,
            };
          });

          return;
        }

        setContextState((prev) => ({
          ...prev,
          consumers: rest,
        }));
      };

      if (!contextState.socket) {
        const socket = new SocketClient(props.wssUrl);

        setContextState((prev) => ({
          ...prev,
          consumers: {
            ...prev.consumers,
            [consumerId]: null,
          },
          socket,
        }));

        return onRelease;
      }

      setContextState((prev) => ({
        ...prev,
        consumers: {
          ...prev.consumers,
          [consumerId]: null,
        },
      }));

      return onRelease;
    },
  });

  return (
    <SocketContext.Provider value={contextState}>
      {props.children}
    </SocketContext.Provider>
  );
};
