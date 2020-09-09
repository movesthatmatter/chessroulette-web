import Chance from 'chance';
import { UserRecord, GuestUserRecord, RegisteredUserRecord } from 'dstnd-io';
import { getRandomInt } from 'src/lib/util';
import { User } from '@sentry/browser';

const chance = new Chance();

export class UserRecordMocker {
  record(isGuest = false): UserRecord {
    const id = chance.guid();

    if (isGuest) {
      return {
        id,
        name: chance.name(),
        avatarId: String(id.slice(-1)[0]),
        isGuest: true,
      };
    }

    const email = chance.email();
    const externalAccountId = chance.guid();

    return {
      id,
      isGuest: false,
      email,
      name: chance.name(),
      avatarId: String(id.slice(-1)[0]),
      externalAccountId,
      externalAccountType: 'lichess',
      externalAccountInfo: {
        email,
        id: externalAccountId,
        username: chance.name(),
        perfs: {
          rapid: this.lichessPerf(),
          blitz: this.lichessPerf(),
          bullet: this.lichessPerf(),
          correspondence: this.lichessPerf(),
          classical: this.lichessPerf(),
          puzzle: this.lichessPerf(),
        },
      },
    };
  }

  private lichessPerf() {
    return {
      games: getRandomInt(0, 1000),
      rating: getRandomInt(1000, 3000),
    };
  }

  withProps(
    props: Partial<Omit<UserRecord, 'isGuest'>>,
    isGuest = false
  ): UserRecord {
    return {
      ...this.record(isGuest),
      ...props,
    };
  }
}
