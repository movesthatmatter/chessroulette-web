import { RoomPlayActivityParticipant } from 'src/modules/Room/RoomActivity/activities/PlayActivity';
import { RoomActivityParticipantMocker } from './RoomActivityParticipant';

const participantMocker = new RoomActivityParticipantMocker();

export class RoomPlayActivityParticipantMocker {
  record(): RoomPlayActivityParticipant {
    const participant = participantMocker.record({ isPresent: true });

    return {
      participant,
      userId: participant.userId,
      isRoomActivitySpecificParticipant: true,
      isPlayer: true,
      roomActivitySpecificParticipantType: 'play',
      canPlay: true,
      materialScore: 0,
      color: 'white',
    };
  }

  withProps(props: Partial<RoomPlayActivityParticipant>): RoomPlayActivityParticipant {
    return {
      ...this.record(),
      ...props,
    };
  }
}
