import { differenceInMilliseconds } from 'date-fns';
import humanizeDuration, { Humanizer } from 'humanize-duration';
import {
  CreateRoomResponse,
  CreateRoomRequest,
  JoinRoomRequestPayload,
  RoomRecord,
} from 'dstnd-io';
import UrlPattern from 'url-pattern';
import { Result, Err, Ok } from 'ts-results';
import { Room } from 'src/components/RoomProvider';

export const noop = () => { 
  // do nothing
};

export const range = (length: number, startAt = 0) =>
  Array.from({ length }, (_, i) => i + startAt);

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

export const toRoomUrlPath = (room: RoomRecord) => `${room.slug}`;

export const urlPathToRoomCredentials = (
  url: string
): Result<JoinRoomRequestPayload['content'], undefined> => {
  const match = new UrlPattern('/gameroom/:id(/:code)').match(url);

  if (!(match && match.id)) {
    return new Err(undefined);
  }

  return new Ok({
    roomId: match.id,
    code: match ? match.code : undefined,
  });
};
