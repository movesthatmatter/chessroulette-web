import { createAction } from 'deox';
import { PeerRecord, RoomRecord } from 'chessroulette-io';
import { Peer } from 'src/providers/PeerConnectionProvider';

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
