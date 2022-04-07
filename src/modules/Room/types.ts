import {
  ClassRoomRecord,
  RoomRecord,
  RoomWithAnalysisActivityRecord,
  RoomWithNoActivityRecord,
  RoomWithPlayActivityRecord,
} from 'chessroulette-io';
import { Peer } from 'src/providers/PeerConnectionProvider';
import { RoomActivity } from './RoomActivity/types';

export type RoomCredentials = {
  id: string;
  code?: string;
};

type RoomBasics = {
  me: Peer;
  peers: Record<string, Peer>;
  peersCount: number;

  peersIncludingMe: Record<string, Peer>;
};

export type Room = RoomRecord & RoomBasics;
export type ClassRoom = ClassRoomRecord & RoomBasics;

export type RoomWithNoActivity = Room & Pick<RoomWithNoActivityRecord, 'activity'>;
export type RoomWithPlayActivity = Room & Pick<RoomWithPlayActivityRecord, 'activity'>;
export type RoomWithAnalysisActivity = Room & Pick<RoomWithAnalysisActivityRecord, 'activity'>;

export type RoomMember = {
  isRoomMember: true;
  userId: Peer['userId'];
peer: Peer;
};

export type RoomMembers = {
  [userId: string]: RoomMember;
};

// This is a type that ties everything together - the activity here is tied to this room
//  it gets created in redux most likely
export type JoinedRoom = Room & {
  // it could have passed activities
  currentActivity: RoomActivity;

  members: RoomMembers;

  // Could be assigned to the craetor or if he leaves to someone else!
  // host
};
