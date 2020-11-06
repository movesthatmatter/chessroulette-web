import Chance from 'chance';
import { ChallengeRecord } from 'dstnd-io';
import { toISODateTime } from 'io-ts-isodatetime';

const chance = new Chance();

export class ChallengeMocker {
  record(type: ChallengeRecord['type'] = 'public'): ChallengeRecord {
    const id = String(chance.integer({ min: 1 }));
    const createdBy = String(chance.integer({ min: 1 }));
    const timeLimits: (ChallengeRecord['gameSpecs']['timeLimit'])[] = [
      'bullet',
      'blitz',
      'rapid',
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
