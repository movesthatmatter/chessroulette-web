import { toDictIndexedBy } from 'src/lib/util';
import { BaseRoomAnalysisActivity } from '../../redux/types';
import { RoomActivityParticipant } from '../../types';
import { RoomAnalysisActivityParticipant, RoomAnalysisActivity } from './types';

const toActivityParticipant = (
  participant: RoomActivityParticipant
): RoomAnalysisActivityParticipant => ({
  isRoomActivitySpecificParticipant: true,
  roomActivitySpecificParticipantType: 'analysis',
  participant,
  userId: participant.userId,
});

export const toRoomAnalysisActivity = (
  currentRoomActivity: BaseRoomAnalysisActivity,
  participantList: RoomActivityParticipant[]
): RoomAnalysisActivity => ({
  ...currentRoomActivity,
  participants: toDictIndexedBy(participantList.map(toActivityParticipant), (p) => p.userId),
});
