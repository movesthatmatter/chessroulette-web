import { createContext } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { SocketConnectionStatusNonOpen, SocketConnectionStatusOpen } from './types';

export type SocketContextProps = {
  consumers: { [consumerId: string]: null };
  onDemand: () => () => void;
} & (
  | {
      socket: SocketClient;
      status: SocketConnectionStatusOpen;
    }
  | {
      socket: undefined;
      status: SocketConnectionStatusNonOpen;
    }
);

export const SocketContext = createContext<SocketContextProps>({
  socket: undefined,
  status: 'init',
  consumers: {},
  onDemand: () => () => undefined,
});
