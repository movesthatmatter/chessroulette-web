import { createContext } from 'react';
import { PeerMessageEnvelope } from 'src/services/peers';
import { SocketClient } from 'src/services/socket/SocketClient';
import { Peer, Room } from './types';
import { PeerConnectionsErrors } from './lib/PeerConnections';
import { Proxy } from './lib/Proxy';
import { RoomCredentials } from './types';

export type PeerContextProps =
  | {
      state: 'joined';
      proxy: Proxy;
      room: Room;
      me: Peer;

      connected: boolean;
      connectToRoom: () => void;
      disconnectFromRoom: () => void;

      broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
      // @deprecate in favor of SendMessage
      request: SocketClient['send'];

      sendMessage: SocketClient['send'];
      onMessage: SocketClient['onMessage'];

      leaveRoom: () => void;
    }
  | {
      state: 'notJoined';
      proxy: Proxy;
      me: Peer;

      // @deprecate in favor of SendMessage
      request: SocketClient['send'];

      sendMessage: SocketClient['send'];
      onMessage: SocketClient['onMessage'];

      joinRoom: (c: RoomCredentials) => void;
    }
  | {
      state: 'init';
    }
  | {
    state: 'error';
    error: PeerConnectionsErrors;
  }

export const PeerContext = createContext<PeerContextProps>({
  state: 'init',
});
