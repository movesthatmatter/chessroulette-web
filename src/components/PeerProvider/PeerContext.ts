import { createContext } from 'react';
import { PeerMessageEnvelope } from 'src/services/peers';
import { noop } from 'src/lib/util';
import { RoomStatsRecord } from 'dstnd-io';
import { Room } from '../RoomProvider';
import { Proxy } from './Proxy';

export type PeerContextProps = ({
  state: 'joined';
  proxy: Proxy;
  room: Room;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
  joinGame: () => void;

  // This simply starts the local stream for local display only!
  startLocalStream: () => void;
  stopLocalStream: () => void;
} | {
  state: 'notJoined';
  proxy?: Proxy;
  roomStats: RoomStatsRecord;
  joinRoom: () => void;
  joinGame: () => void;
} | {
  state: 'init';
});

export const PeerContext = createContext<PeerContextProps>({
  state: 'init',
});
