import { PeerRecord } from 'dstnd-io';
import Chance from 'chance';
import { UserRecordMocker } from './UserRecordMocker';

const chance = new Chance();

const userRecordMock = new UserRecordMocker();

export class PeerRecordMock {
  record(): PeerRecord {
    return {
      id: String(chance.integer({ min: 1 })),
      user: userRecordMock.record(),
    };
  }

  withProps(props: Partial<PeerRecord>): PeerRecord {
    return {
      ...this.record(),
      ...props,
    };
  }
}
