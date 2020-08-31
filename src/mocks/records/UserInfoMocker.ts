import Chance from 'chance';
import { UserInfoRecord } from 'dstnd-io';

const chance = new Chance();

export class UserInfoMocker {
  record(): UserInfoRecord {
    const id = String(chance.integer({ min: 1 }));

    return {
      id,
      name: chance.name(),
      avatarId: String(id.slice(-1)[0]),
    };
  }

  withProps(props: Partial<UserInfoRecord>): UserInfoRecord {
    return {
      ...this.record(),
      ...props,
    };
  }
}
