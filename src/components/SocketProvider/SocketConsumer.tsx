import React, { useContext, useEffect, useState } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { noop } from 'src/lib/util';
import { SocketContext } from './SocketProvider';

type Props = {
  wssURL?: string;

  fallbackRender?: () => React.ReactNode;
  render: (renderProps: {
    send: SocketClient['send'];
    socket: SocketClient;
  }) => React.ReactNode;

  onMessage?: Parameters<SocketClient['onMessage']>[0];
}

export const SocketConsumer: React.FC<Props> = ({
  onMessage = noop,
  ...props
}) => {
  const contextState = useContext(SocketContext);
  const [socket, setSocket] = useState<SocketClient | undefined>(undefined);

  useEffect(() => {
    setSocket(contextState.socket);

    if (contextState.socket) {
      const unsubscribeOnmessage = contextState.socket.onMessage(onMessage);

      return () => {
        unsubscribeOnmessage();
      };
    }

    return undefined;
  }, [contextState.socket]);

  useEffect(() => {
    const releaser = contextState.onDemand();

    return () => {
      releaser();
    };
  }, []);

  if (!socket) {
    return (
      <>{props.fallbackRender?.()}</>
    );
  }

  return (
    <>
      {
        props.render({
          socket,
          send: socket.send.bind(socket),
        })
      }
    </>
  );
};
