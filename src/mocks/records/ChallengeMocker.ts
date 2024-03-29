import Chance from 'chance';
import { ChallengeRecord } from 'chessroulette-io';
import { toISODateTime } from 'io-ts-isodatetime';
import { UserInfoMocker } from './UserInfoMocker';

const chance = new Chance();
const userInfoMocker = new UserInfoMocker();

export class ChallengeMocker {
  record(type: ChallengeRecord['type'] = 'public'): ChallengeRecord {
    const id = String(chance.integer({ min: 1 }));
    const createdBy = String(chance.integer({ min: 1 }));
    const timeLimits: (ChallengeRecord['gameSpecs']['timeLimit'])[] = [
      'bullet30',
      'bullet1',
      'blitz2',
      'blitz3',
      'blitz5',
      'rapid10',
      'rapid15',
      'rapid20',
      'rapid30',
      'rapid45',
      'rapid60',
      'untimed',
    ];
    const preferredColorOptions: (ChallengeRecord['gameSpecs']['preferredColor'])[] = [
      'white',
      'black',
      'random',
    ];

    const record: ChallengeRecord = {
      id,
      type,
      slug: chance.hash({ length: 8 }),
      gameSpecs: {
        timeLimit: timeLimits[chance.integer({ min: 0, max: 3 })],
        preferredColor: preferredColorOptions[chance.integer({ min: 0, max: 2 })],
      },
      createdAt: toISODateTime(new Date()),
      createdBy,
      createdByUser: userInfoMocker.record(),
    };

    return record;
  }

  withProps(props: Partial<ChallengeRecord>): ChallengeRecord {
    return {
      ...this.record(),
      ...props,
    };
  }
}
