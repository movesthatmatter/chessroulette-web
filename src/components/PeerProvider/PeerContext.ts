import { createContext } from 'react';
import { PeerMessageEnvelope } from 'src/services/peers';
import { RoomStatsRecord, SocketPayload } from 'dstnd-io';
import { SocketClient } from 'src/services/socket/SocketClient';
import { Room } from '../RoomProvider';
import { Proxy } from './Proxy';

export type PeerContextProps =
  | {
      state: 'joined';
      proxy: Proxy;
      room: Room;
      broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
      request: SocketClient['send'];

      // This simply starts the local stream for local display only!
      startLocalStream: () => void;
      stopLocalStream: () => void;
    }
  | {
      state: 'notJoined';
      proxy?: Proxy;
      roomStats: RoomStatsRecord;
      request: SocketClient['send'];

      joinRoom: () => void;
    }
  | {
      state: 'init';
    };

export const PeerContext = createContext<PeerContextProps>({
  state: 'init',
});
