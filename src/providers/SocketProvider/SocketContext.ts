import { createContext } from "react";
import { SocketClient } from "src/services/socket/SocketClient";

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