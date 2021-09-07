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
    return isPresent ? this.asPresentMember() : this.asAbsentMember();
  }

  asPresentMember(): RoomActivityPresentParticipant {
    const member = roomMember.record();

    return {
      member,
      isActivityParticipant: true,
      userId: member.userId,
      isMe: false,
      isPresent: true,
    };
  }

  asAbsentMember(): RoomActivityAbsentParticipant {
    const member = roomMember.record();

    return {
      isActivityParticipant: true,
      userId: member.userId,
      isMe: false,
      isPresent: false,
      user: member.peer.user,
    };
  }

  withProps(p: { isPresent: true } & Partial<RoomActivityParticipant>): RoomActivityPresentParticipant;
  withProps(p: { isPresent: false } & Partial<RoomActivityParticipant>): RoomActivityAbsentParticipant;
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
