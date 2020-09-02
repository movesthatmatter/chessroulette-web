import Chance from 'chance';
import { UserRecord } from 'dstnd-io';

const chance = new Chance();

export class UserRecordMocker {
  record(isGuest = false): UserRecord {
    const id = chance.guid();

    return {
      id,
      name: chance.name(),
      avatarId: String(id.slice(-1)[0]),
      isGuest,
    };
  }

  withProps(props: Partial<UserRecord>, isGuest = false): UserRecord {
    return {
      ...this.record(isGuest),
      ...props,
    };
  }
}
