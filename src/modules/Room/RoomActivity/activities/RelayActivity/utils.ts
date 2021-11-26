import { RoomMember } from 'src/modules/Room/types';
import { BaseRoomRelayActivity } from '../../redux/types';
import { RoomActivityParticipant } from '../../types';
import { RoomRelayActivity, RoomRelayActivityParticipant } from './types';
import deepCopy from 'deep-copy';
import { toDictIndexedBy } from 'src/lib/util';
import { toRoomActivityPresentParticipant } from '../../util/participantsUtil';

const toRelayParticipant = (
  participant: RoomActivityParticipant
): RoomRelayActivityParticipant => ({
  isRoomActivitySpecificParticipant: true,
  roomActivitySpecificParticipantType: 'relay',
  participant: deepCopy(participant),
  userId: participant.userId
})

export const toRoomRelayActivity = (
  baseActivity: BaseRoomRelayActivity,
  members: RoomMember[]
): RoomRelayActivity => {

  const {game} = baseActivity;

  if (!game){
    return {
      ...baseActivity,
      game: undefined,
      participants: toDictIndexedBy(
        members.map(toRoomActivityPresentParticipant).map(toRelayParticipant),
        (p) => p.userId
      )
    }
  }

  return {
    ...baseActivity,
    game,
    participants: toDictIndexedBy(
      members.map(toRoomActivityPresentParticipant).map(toRelayParticipant),
      (p) => p.userId
    )
  }
}