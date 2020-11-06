import Chance from 'chance';
import { UserInfoRecord } from 'dstnd-io';
import { getRandomInt } from 'src/lib/util';

const chance = new Chance();

export class UserInfoMocker {
  record(): UserInfoRecord {
    const id = String(chance.integer({ min: 1 }));

    return {
      id,
      name: chance.name(),
      avatarId: String(getRandomInt(0, 18)),
    };
  }

  withProps(props: Partial<UserInfoRecord>): UserInfoRecord {
    return {
      ...this.record(),
      ...props,
    };
  }
}
