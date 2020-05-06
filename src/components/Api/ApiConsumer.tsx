import React, { useState, useEffect } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { noop } from 'src/lib/util';
import { ApiContext } from './context';

type Props = {
  wssURL?: string;

  fallbackRender?: () => React.ReactNode;
  render: (renderProps: {
    send: SocketClient['send'];
    socket: SocketClient;
  }) => React.ReactNode;

  onMessage?: Parameters<SocketClient['onMessage']>[0];
};

export const ApiConsumer: React.FC<Props> = ({
  onMessage = noop,
  ...props
}) => {
  const [socket, setSocket] = useState<SocketClient | undefined>(undefined);
  const [unsubscribers, setUnsubscribers] = useState<Function[]>([]);

  useEffect(() => () => {
    // Unsubscribe from all
    unsubscribers.forEach((unsubscribe) => unsubscribe());

    // socket?.
  }, []);

  return (
    <ApiContext.Consumer>
      {({ socketConnection }) => {
        // If different instance
        if (socketConnection !== socket && socketConnection) {
          const unsubscribeFromOnMessage = socketConnection?.onMessage(onMessage);

          // If there are any previus subscribers, unsubscribe
          unsubscribers.forEach((unsubscribe) => unsubscribe());

          // Set the new connection
          setSocket(socketConnection);

          // Set the new unsubscribers
          setUnsubscribers([
            ...unsubscribers,
            unsubscribeFromOnMessage,
          ]);

          return null;
        }

        return (
          (socket && socketConnection)
            ? props.render({
              send: socket.send.bind(socket),
              socket: socketConnection,
            })
            : props.fallbackRender?.()
        );
      }}
    </ApiContext.Consumer>
  );
};
