import { createContext } from 'react';
import { PeerMessageEnvelope } from 'src/services/peers';
import { SocketClient } from 'src/services/socket/SocketClient';
import { Peer, Room } from '../RoomProvider';
import { Proxy } from './Proxy';
import { RoomCredentials } from './util';

export type PeerContextProps =
  | {
      state: 'joined';
      proxy: Proxy;
      room: Room;
      me: Peer;
      broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
      request: SocketClient['send'];
      leaveRoom: () => void;

      // This simply starts the local stream for local display only!
      startLocalStream: () => void;
      stopLocalStream: () => void;
    }
  | {
      state: 'notJoined';
      proxy?: Proxy;
      // room: RoomRecord;
      me: Peer;
      request: SocketClient['send'];

      joinRoom: (c: RoomCredentials) => void;
    }
  | {
      state: 'init';
    };

export const PeerContext = createContext<PeerContextProps>({
  state: 'init',
});
