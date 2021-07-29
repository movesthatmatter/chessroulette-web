import { Peer, Room } from 'src/providers/PeerProvider';
import { RoomActivity } from './Activities/types';

export type RoomMember = {
  isRoomMember: true;
  userId: Peer['userId'];
  peer: Peer;
};

export type RoomMembers = {
  [userId: string]: RoomMember;
};

// This is a type that sticks together - the activity here is tied to this room
//  it gets created in redux most likely
export type JoinedRoom = Room & {
  // it could have passed activities
  currentActivity: RoomActivity;

  members: RoomMembers;

  // Could be assigned to the craetor or if he leaves to someone else!
  // host
};

