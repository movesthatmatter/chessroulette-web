import { SocketClient } from 'src/services/socket/SocketClient';

export type SocketReceivableMessage = Parameters<Parameters<SocketClient['onMessage']>[0]>[0];

// Taken from here
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState#value
export type SocketConnectionStatus =
  | 'connecting'
  | 'open'
  | 'closing'
  | 'closed'
  // These are new
  | 'init' // Initial State
  | 'disconnected'; // it was open, now it's closed

export type SocketConnectionStatusOpen = Extract<SocketConnectionStatus, 'open'>;
export type SocketConnectionStatusNonOpen = Exclude<
  SocketConnectionStatus,
  SocketConnectionStatusOpen
>;
