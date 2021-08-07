import { RoomMember } from 'src/modules/Room/types';
import { RoomAnalysisActivity } from './activities/AnalysisActivity/types';
import { RoomNoActivity } from './activities/NoActivity/types';
import { RoomPlayActivity } from './activities/PlayActivity';

export type RoomActivityParticipant = {
  userId: RoomMember['userId'];
  member: RoomMember;
  isActivityParticipant: true;
};

export type RoomActivityParticipants = {
  [userId: string]: RoomActivityParticipant;
};

export type RoomActivity = RoomNoActivity | RoomPlayActivity | RoomAnalysisActivity;
