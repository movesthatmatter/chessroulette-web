import { RoomRecord } from 'chessroulette-io';
import { Peer } from 'src/providers/PeerProvider';
import { RoomMember } from './types';
import deepCopy from 'deep-copy';

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
