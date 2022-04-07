import deepCopy from 'deep-copy';
import { RoomRecord } from 'chessroulette-io';
import { RoomMember } from './types';
import { Peer } from 'src/providers/PeerConnectionProvider';
import { ISODateTime } from 'src/lib/date/ISODateTime';
import { isAfter, isBefore } from 'date-fns';

export const toRoomMember = (peer: Peer): RoomMember => ({
  isRoomMember: true,
  userId: peer.userId,
  // Ensure this creates a new object so React triggers a render correctly
  peer: deepCopy(peer),
});

export const getRoomPendingChallenge = (room: RoomRecord) => {
  return Object.values(room.pendingChallenges || {})[0];
};

// I don't think these are needed anymore
// export const isRoomMember = (peer: object): peer is RoomMember => {
//   return keyInObject(peer, 'isRoomMember') && peer.isRoomMember === true;
// };

export const isDateInTheFuture = (d: Date | ISODateTime) => {
  const now = new Date();
  return isAfter(new Date(d), now);
};

export const isDateInThePast = (d: Date | ISODateTime) => {
  const now = new Date();
  return isBefore(new Date(d), now);
};
