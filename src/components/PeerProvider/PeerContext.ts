import { createContext } from 'react';
import { PeerMessageEnvelope } from 'src/services/peers';
import PeerSDK from 'peerjs';
import { noop } from 'src/lib/util';
import { Room } from '../RoomProvider';
import { Proxy } from './Proxy';

// export type PeerContextProps = {
//   connected: true;
//   room: Room;
//   broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
// } | {
//   connected: false;
// };

export type PeerContextProps = {
  // state
  proxy?: Proxy;
  room?: Room;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;


  // peerSDK?: PeerSDK;
  // connected: true;

  // onPeerMsgReceived?: (
  //   msg: PeerMessageEnvelope,

  //   // TODO: Is this really needed?
  //   p: Pick<PeerContextProps, 'broadcastMessage'>
  // ) => void;
  // onPeerMsgSent?: (
  //   msg: PeerMessageEnvelope,

  //   // TODO: Is this really needed?
  //   p: Pick<PeerContextProps, 'broadcastMessage'>
  // ) => void;
};

export const PeerContext = createContext<PeerContextProps>({
  broadcastMessage: noop,
});
