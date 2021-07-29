import { RoomMember } from '../types';
import { toRoomPlayActivity } from './PlayActivity/util';
import { toRoomAnalysisActivity } from './AnalysisActivity/util';
import { BaseRoomActivity } from './redux/types';
import { RoomActivity, RoomActivityParticipant } from './types';

export const toRoomActivityParticipant = (roomMember: RoomMember): RoomActivityParticipant => ({
  userId: roomMember.userId,
  member: roomMember,
  isActivityParticipant: true,
});

export const toRoomActivity = (
  currentRoomActivity: BaseRoomActivity,
  members: RoomMember[]
): RoomActivity => {
  if (currentRoomActivity.type === 'play') {
    return toRoomPlayActivity(currentRoomActivity, members.map(toRoomActivityParticipant));
  }

  if (currentRoomActivity.type === 'analysis') {
    return toRoomAnalysisActivity(currentRoomActivity, members.map(toRoomActivityParticipant));
  }

  return {
    ...currentRoomActivity,
    participants: undefined,
  } as const;
};
