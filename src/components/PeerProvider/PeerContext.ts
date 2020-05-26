import { createContext } from 'react';
import { PeerMessageEnvelope } from 'src/services/peers';
import { Room } from '../RoomProvider';
import { Proxy } from './Proxy';

export type PeerContextProps = {
  state: 'connected';
  proxy: Proxy;
  room: Room;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
} | {
  state: 'init' | 'connecting';
  proxy?: Proxy;
  room?: Room;
  broadcastMessage?: (m: PeerMessageEnvelope['message']) => void;
};

export const PeerContext = createContext<PeerContextProps>({
  state: 'init',
});
