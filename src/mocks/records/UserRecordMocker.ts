import Chance from 'chance';
import { UserRecord, GuestUserRecord, RegisteredUserRecord } from 'dstnd-io';
import { getRandomInt } from 'src/lib/util';

const chance = new Chance();

export class UserRecordMocker {
  public record(isGuest: false): RegisteredUserRecord;

  public record(isGuest: true): GuestUserRecord;

  public record(isGuest?: boolean): GuestUserRecord;

  public record(isGuest = false): UserRecord {
    const id = chance.guid().slice(0, 4);

    const firstName = chance.first();
    const lastName = chance.last();
    const name = `${firstName} ${lastName}`;

    if (isGuest) {
      return {
        id,
        firstName,
        lastName,
        name,
        avatarId: String(getRandomInt(1, 18)),
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
      firstName,
      lastName,
      name,
      avatarId: String(getRandomInt(1, 18)),
      profilePicUrl: undefined,
      externalAccounts: undefined,
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
  ): TIsGuest extends false ? RegisteredUserRecord : GuestUserRecord {
    return {
      ...this.record(isGuest),
      ...props,
    } as any;
  }
}
