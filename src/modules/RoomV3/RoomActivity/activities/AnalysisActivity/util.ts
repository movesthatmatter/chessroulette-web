import { toDictIndexedBy } from 'src/lib/util';
import { RoomMember } from 'src/modules/RoomV3/types';
import { BaseRoomAnalysisActivity } from '../../redux/types';
import { RoomActivityParticipant } from '../../types';
import { toRoomActivityPresentParticipant } from '../../util/participantsUtil';
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
  // participantList: RoomActivityParticipant[]
  members: RoomMember[]
): RoomAnalysisActivity => ({
  ...currentRoomActivity,
  participants: toDictIndexedBy(
    members.map(toRoomActivityPresentParticipant).map(toActivityParticipant),
    (p) => p.userId
  ),
});
