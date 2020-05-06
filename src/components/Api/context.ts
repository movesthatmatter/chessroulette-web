import { createContext } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
// import { ConnectionState } from './types';


export type ApiContextProps = {
  socketConnection: SocketClient | undefined;

  // Add when it's ready
  // http: HttpClient;
}

export const ApiContext = createContext<ApiContextProps>({
  socketConnection: undefined,
});
