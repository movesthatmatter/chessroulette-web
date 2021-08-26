import { RoomNoActivityParticipant } from 'src/modules/Room/RoomActivity/activities/NoActivity/types';
import {
  RoomActivityAbsentParticipant,
  RoomActivityParticipant,
  RoomActivityPresentParticipant,
} from 'src/modules/Room/RoomActivity/types';
import { RoomMemberMocker } from './RoomMemberMocker';

const roomMember = new RoomMemberMocker();

export class RoomActivityParticipantMocker {
  record(p: { isPresent: true }): RoomActivityPresentParticipant;
  record(p: { isPresent: false }): RoomActivityAbsentParticipant;
  record({ isPresent = true }: { isPresent: boolean }): RoomActivityParticipant {
    const member = roomMember.record();

    if (isPresent) {
      return {
        member,
        isActivityParticipant: true,
        userId: member.userId,
        isMe: false,
        isPresent: true,
      };
    }

    return {
      isActivityParticipant: true,
      userId: member.userId,
      isMe: false,
      isPresent: false,
      user: member.peer.user,
    };
  }

  withProps(props: Partial<RoomActivityParticipant>): RoomActivityParticipant {
    if (props.isPresent === false) {
      return {
        ...this.record({ isPresent: false }),
        ...props,
      };
    }

    return {
      ...this.record({ isPresent: true }),
      ...props,
      isPresent: true,
    };
  }
}
