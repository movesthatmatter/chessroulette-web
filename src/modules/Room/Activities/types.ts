import { RoomMember } from 'src/modules/Room/types';
import { RoomAnalysisActivity } from './AnalysisActivity/types';
import { RoomNoActivity } from './NoActivity/types';
import { RoomPlayActivity } from './PlayActivity/types';

export type RoomActivityParticipant = {
  userId: RoomMember['userId'];
  member: RoomMember;
  isActivityParticipant: true;
};

export type RoomActivityParticipants = {
  [userId: string]: RoomActivityParticipant;
};

export type RoomActivity = RoomNoActivity | RoomPlayActivity | RoomAnalysisActivity;
