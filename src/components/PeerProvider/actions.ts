import { createAction } from 'deox';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';

export const createRoomAction = createAction(
  'Create Room',
  (resolve) => (p: {
    room: RoomStatsRecord;
    me: PeerRecord;
  }) => resolve(p),
);

export const updateRoomAction = createAction(
  'Update Room',
  (resolve) => (p: {
    room: RoomStatsRecord;
  }) => resolve(p),
);

export const removeRoomAction = createAction('Remove Room');

export const addPeerAction = createAction(
  'Add Peer',
  (resolve) => (p: PeerRecord) => resolve(p),
);

export const removePeerAction = createAction(
  'Remove Peer',
  (resolve) => (p: {peerId: PeerRecord['id']}) => resolve(p),
);

export const addMyStream = createAction(
  'Add My Stream',
  (resolve) => (p: {
    stream: MediaStream;
  }) => resolve(p),
);

export const remmoveMyStream = createAction(
  'Remove My Stream',
);

export const addPeerStream = createAction(
  'Add Peer Stream',
  (resolve) => (p: {
    peerId: string;
    stream: MediaStream;
  }) => resolve(p),
);
