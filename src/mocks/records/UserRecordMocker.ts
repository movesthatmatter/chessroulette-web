import Chance from 'chance';
import { UserRecord, GuestUserRecord, RegisteredUserRecord } from 'dstnd-io';
import { getRandomInt } from 'src/lib/util';

const chance = new Chance();

export class UserRecordMocker {
  public record(isGuest: false): RegisteredUserRecord;

  public record(isGuest: true): GuestUserRecord;

  public record(isGuest?: boolean): GuestUserRecord;

  public record(isGuest = false): UserRecord {
    const id = chance.guid();

    if (isGuest) {
      return {
        id,
        name: chance.name(),
        avatarId: String(id.slice(-1)[0]),
        isGuest: true,
        sid: String((new Date().getTime())),
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

  withProps<TIsGuest extends boolean = false>(
    props: Partial<Omit<UserRecord, 'isGuest'>>,
    isGuest: TIsGuest = false as TIsGuest,
  ): TIsGuest extends false ? RegisteredUserRecord: GuestUserRecord  {
    return {
      ...this.record(isGuest),
      ...props,
    } as any;
  }
}
