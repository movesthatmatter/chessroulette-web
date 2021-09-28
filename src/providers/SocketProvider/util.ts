import { SocketClient } from 'src/services/socket/SocketClient';
import { WebSocket } from 'window-or-global';
import { SocketConnectionStatus } from './types';

export const getSocketConnectionStatus = (client: SocketClient): SocketConnectionStatus => {
  if (client.connection.readyState === WebSocket.OPEN) {
    return 'open';
  }

  if (client.connection.readyState === WebSocket.CLOSED) {
    return 'closed';
  }

  if (client.connection.readyState === WebSocket.CLOSING) {
    return 'closing';
  }

  return 'connecting';
};
