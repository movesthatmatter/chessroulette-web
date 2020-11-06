import { PeerRecord } from 'dstnd-io';
import Chance from 'chance';
import { UserRecordMocker } from './UserRecordMocker';
import { toISODateTime } from 'io-ts-isodatetime';

const chance = new Chance();

const userRecordMock = new UserRecordMocker();

export class PeerRecordMock {
  record(): PeerRecord {
    return {
      id: String(chance.integer({ min: 1, max: 999 })),
      user: userRecordMock.record(),
      hasJoinedRoom: true,
      joinedRoomAt: toISODateTime(new Date()),
      joinedRoomId: String(chance.integer({ min: 1, max: 9999 })),
    };
  }

  withProps(props: Partial<PeerRecord>) : PeerRecord {
    return {
      ...this.record(),
      ...props,
      ...(props.hasJoinedRoom) ? {
        hasJoinedRoom: true,
        joinedRoomAt: props.joinedRoomAt || toISODateTime(new Date()),
        joinedRoomId: props.joinedRoomId || String(chance.integer({ min: 1, max: 999 })),
      } : {
        hasJoinedRoom: false,
        joinedRoomAt: null,
        joinedRoomId: null,
      }
    };
  }
}
