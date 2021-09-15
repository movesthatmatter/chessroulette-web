import { SocketClient } from 'src/services/socket/SocketClient';

export type SocketReceivableMessage = Parameters<Parameters<SocketClient['onMessage']>[0]>[0];
