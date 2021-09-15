import { RoomRecord } from 'dstnd-io';
import { Peer } from 'src/providers/PeerProvider';
import { RoomMember } from './types';

export const toRoomMember = (peer: Peer): RoomMember => ({
  isRoomMember: true,
  userId: peer.userId,
  peer,
});

export const getRoomPendingChallenge = (room: RoomRecord) => {
  return Object.values(room.pendingChallenges || {})[0];
};

// I don't think these are needed anymore
// export const isRoomMember = (peer: object): peer is RoomMember => {
//   return keyInObject(peer, 'isRoomMember') && peer.isRoomMember === true;
// };
