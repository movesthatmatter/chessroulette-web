import { RoomMember } from 'src/modules/Room/types';
import { PeerMocker } from './PeerMocker';

const peerMocker = new PeerMocker();

export class RoomMemberMocker {
  record(): RoomMember {
    const peer = peerMocker.record();

    return {
      peer,
      isRoomMember: true,
      userId: peer.userId,
    };
  }

  withProps(props: Partial<RoomMember>): RoomMember {
    return {
      ...this.record(),
      ...props,
    };
  }
}
