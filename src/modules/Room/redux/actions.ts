import { createAction } from 'deox';
import { PeerRecord, RoomRecord } from 'dstnd-io';
import { Peer } from 'src/providers/PeerProvider';

export const createRoomAction = createAction(
  'Create Room',
  (resolve) => (p: { room: RoomRecord; me: Peer }) => resolve(p)
);

export const updateRoomAction = createAction(
  'Update Room',
  (resolve) => (p: { room: RoomRecord }) => resolve(p)
);

export const updateRoomPeerConnectionChannels = createAction(
  'Update Room Peer Connection Channels',
  (resolve) => (p: {
    peerId: PeerRecord['id'];
    channels: Partial<Peer['connection']['channels']>;
  }) => resolve(p)
);

export const removeRoomAction = createAction('Remove Room');
