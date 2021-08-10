import { differenceInMilliseconds } from 'date-fns';
import humanizeDuration, { Humanizer } from 'humanize-duration';
import { RoomRecord, ChallengeRecord } from 'dstnd-io';

export const noop = () => {
  // do nothing
};

export const range = (length: number, startAt = 0) => Array.from({ length }, (_, i) => i + startAt);

/**
 * https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 *
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(givenMin: number, givenMax: number) {
  const min = Math.ceil(givenMin);
  const max = Math.floor(givenMax);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 *
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export function shuffle<T extends unknown>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const randomId = () => String(Math.random()).slice(2);

export const complement = <T>(anySide: T, [sideA, sideB]: readonly [T, T]) =>
  sideA === anySide ? sideB : sideA;

export const durationFormats = {
  minimal: humanizeDuration.humanizer({
    largest: 2,
    round: true,
  }),
};

export const prettyTimeDiff = (
  dateLeft: Date,
  dateRight: Date,
  {
    format = durationFormats.minimal,
    options = {},
  }: {
    format?: Humanizer;
    options?: humanizeDuration.Options;
  } = {}
) => format(differenceInMilliseconds(dateLeft, dateRight), options);

export const prettyCountdown = (
  ms: number,
  {
    format = humanizeDuration.humanizer({
      language: 'custom',
      languages: {
        custom: {
          y: () => 'y',
          mo: () => 'mo',
          w: () => 'w',
          d: () => 'd',
          h: () => 'hr',
          m: () => 'min',
          s: () => 's',
          ms: () => 'ms',
        },
      },
    }),
    options = {
      largest: 2,
      round: true,
      delimiter: ' ',
      spacer: '',
      // units: ['d', 'h', 'm'],
    },
  }: {
    format?: Humanizer;
    options?: humanizeDuration.Options;
  }
) => format(ms, options);

export const toRoomUrlPath = (room: RoomRecord) => room.slug;
export const toChallengeUrlPath = (challenge: ChallengeRecord) => challenge.slug;

export const hasOwnProperty = <X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> => obj.hasOwnProperty(prop);

// Use this to get inherited keys as well
export const keyInObject = <X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> => prop in obj;

// Immutably Reverses an Array
// This is needed b/c the native Array.reverse() mutates in place
export const arrReverse = <T>(arr: T[]): T[] => arr.slice(0).reverse() as T[];

export const flatten = <T>(a: T[]) =>
  a.reduce((accumulator, value) => accumulator.concat(value), [] as T[]);

export const objectKeys = <O extends object>(o: O) => Object.keys(o) as (keyof O)[];

export const toDictIndexedBy = <O extends object, KGetter extends (o: O) => string>(
  list: O[],
  getKey: KGetter
) =>
  list.reduce(
    (prev, next) => ({
      ...prev,
      [getKey(next)]: next,
    }),
    {} as { [k: string]: O }
  );

export const addSliceToDict = <
  O extends object,
  K extends string,
  V extends unknown,
  S extends { [k in K]: V }
>(
  dict: O,
  slice: S
) =>
  ({
    ...dict,
    ...slice,
  } as O & S);
