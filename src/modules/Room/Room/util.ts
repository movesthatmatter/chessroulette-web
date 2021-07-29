import { keyInObject } from 'src/lib/util';
import { Peer } from 'src/providers/PeerProvider';
import { RoomMember } from '../types';

export const toRoomMember = (peer: Peer): RoomMember => ({
  isRoomMember: true,
  userId: peer.userId,
  peer,
});

// I don't think these are needed anymore
// export const isRoomMember = (peer: object): peer is RoomMember => {
//   return keyInObject(peer, 'isRoomMember') && peer.isRoomMember === true;
// };
