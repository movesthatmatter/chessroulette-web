import Chance from 'chance';
import { UserInfoRecord } from 'dstnd-io';
import { getRandomInt } from 'src/lib/util';

const chance = new Chance();

export class UserInfoMocker {
  record(): UserInfoRecord {
    const id = String(chance.integer({ min: 1 }));

    const firstName = chance.first();
    const lastName = chance.last();
    const name = `${firstName} ${lastName}`;

    return {
      id,
      firstName,
      lastName,
      name,
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
