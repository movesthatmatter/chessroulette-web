import React, { useRef } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { ApiContext } from './context';

type Props = {
  wssURL?: string;
};

export const ApiProvider: React.FC<Props> = (props) => {
  // TODO: Open the connection only on demand, when the client is
  // actually rendered, otherwise it stays open for no reason
  const socketConnection = useRef(new SocketClient(props.wssURL));

  // And also close when all the clients are out of mission
  // Otherwise it stays on

  return (
    <ApiContext.Provider
      value={{
        socketConnection: socketConnection.current,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};
