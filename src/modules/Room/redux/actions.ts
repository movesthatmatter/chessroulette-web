import { createAction } from 'deox';
import { RoomRecord } from 'dstnd-io';
import { Peer } from 'src/providers/PeerProvider';

export const createRoomAction = createAction(
  'Create Room',
  (resolve) => (p: { room: RoomRecord; me: Peer }) => resolve(p)
);

export const updateRoomAction = createAction(
  'Update Room',
  (resolve) => (p: { room: RoomRecord }) => resolve(p)
);

export const removeRoomAction = createAction('Remove Room');
