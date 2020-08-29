import { createContext } from 'react';
import { PeerMessageEnvelope } from 'src/services/peers';
import { noop } from 'src/lib/util';
import { Room } from '../RoomProvider';
import { Proxy } from './Proxy';

export type PeerContextProps = ({
  state: 'connected';
  proxy: Proxy;
  room: Room;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
} | {
  state: 'init' | 'connecting';
  proxy?: Proxy;
  room?: Room;
  broadcastMessage?: (m: PeerMessageEnvelope['message']) => void;
}) & {
  // Show local stream
  showMyStream: () => void;
};

export const PeerContext = createContext<PeerContextProps>({
  state: 'init',
  showMyStream: noop,
});
