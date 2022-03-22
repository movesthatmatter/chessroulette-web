import { createAction } from 'deox';
import { PeerRecord, RoomRecord } from 'dstnd-io';

export const createMeAction = createAction(
  'Create Me',
  (resolve) => (p: { me: PeerRecord; joinedRoom?: RoomRecord }) => resolve(p)
);

export const updateMeAction = createAction(
  'Update Me',
  (resolve) => (p: { me: PeerRecord; joinedRoom?: RoomRecord }) => resolve(p)
);

export const removeMeAction = createAction('Remove Me', (resolve) => () => resolve());



// TODO: Move these into StreamingProvider
export const addPeerStream = createAction(
  'Add Peer Stream',
  (resolve) => (p: { peerId: string; stream: MediaStream }) => resolve(p)
);

export const removePeerStreamAction = createAction(
  'Remove Peer Stream',
  (resolve) => (p: { peerId: PeerRecord['id'] }) => resolve(p)
);

export const closePeerChannelsAction = createAction(
  'Close Peer Channels',
  (resolve) => (p: { peerId: PeerRecord['id'] }) => resolve(p)
);




// TODO: Move this into the Room Provider
// Moved
export const createRoomAction = createAction(
  'Create Room',
  (resolve) => (p: { room: RoomRecord; me: PeerRecord }) => resolve(p)
);

export const updateRoomAction = createAction(
  'Update Room',
  (resolve) => (p: { room: RoomRecord }) => resolve(p)
);

export const removeRoomAction = createAction('Remove Room');