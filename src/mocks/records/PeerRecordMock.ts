import { PeerRecord } from 'dstnd-io';
import Chance from 'chance';
import { UserInfoMocker } from './UserInfoMocker';

const chance = new Chance();

const userInfoMock = new UserInfoMocker();

export class PeerRecordMock {
  record(): PeerRecord {
    return {
      id: String(chance.integer({ min: 1 })),
      user: userInfoMock.record(),
    };
  }

  withProps(props: Partial<PeerRecord>): PeerRecord {
    return {
      ...this.record(),
      ...props,
    };
  }
}
