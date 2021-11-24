import Chance from 'chance';
import { UserInfoRecord } from 'dstnd-io';
import { getRandomInt } from 'src/lib/util';
import { getAllCountries } from 'src/services/Location/resources';

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
      country: {
        code: 'US',
        name: 'United States',
        currency: 'USD',
        languages: ['english'],
        flagEmoji: '',
        flagEmojiU: '',
        phone: '',
      },
      username: `${chance.animal()}.${chance.city()}`,
      isGuest: false,
      profilePicUrl: '',
    };
  }

  withProps(props: Partial<UserInfoRecord>): UserInfoRecord {
    return {
      ...this.record(),
      ...props,
    } as UserInfoRecord;
  }
}
