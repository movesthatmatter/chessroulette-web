import { createContext } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { Peer, Room } from './types';
import { PeerConnectionsErrors } from './lib/PeerConnections';
import { RoomCredentials } from './types';

export type PeerContextState =
  | {
      status: 'init';
      ready: false;
    }
  | ({
      ready: true;
      status: 'open';
      client: SocketClient;
      me: Peer;
    } & (
      | {
          hasJoinedRoom: true;
          room: Room;
          connected: boolean;
          connectionAttempt: boolean;
          connectToRoom: () => void;
          disconnectFromRoom: () => void;
          leaveRoom: () => void;
        }
      | {
          hasJoinedRoom: false;
          joinRoom: (c: RoomCredentials) => void;
        }
    ))
  | {
      ready: false;
      status: 'closed';
      error?: PeerConnectionsErrors;
    };

export const PeerContext = createContext<PeerContextState>({
  status: 'init',
  ready: false,
});
