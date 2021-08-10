import { UserInfoRecord } from 'dstnd-io';
import { RoomMember } from '../types';
import { RoomAnalysisActivity } from './activities/AnalysisActivity/types';
import { RoomNoActivity } from './activities/NoActivity/types';
import { RoomPlayActivity } from './activities/PlayActivity';

type RoomActivityBasicParticipantInfo = {
  userId: RoomMember['userId'];
  isActivityParticipant: true;
  isMe: boolean;
}

export type RoomActivityPresentParticipant = RoomActivityBasicParticipantInfo & {
  isPresent: true;
  member: RoomMember;
};

export type RoomActivityAbsentParticipant = RoomActivityBasicParticipantInfo & {
  isPresent: false;
  user: UserInfoRecord;
};

export type RoomActivityParticipant = RoomActivityPresentParticipant | RoomActivityAbsentParticipant;

export type RoomActivityParticipants = {
  [userId: string]: RoomActivityParticipant;
};

export type RoomActivity = RoomNoActivity | RoomPlayActivity | RoomAnalysisActivity;
