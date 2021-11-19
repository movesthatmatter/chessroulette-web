import { toISODateTime } from 'io-ts-isodatetime';

// https://www.chess.com/events/2021-fide-world-chess-championship/schedule
export const HARDCODED_WCC_Schedule = [
  {
    eventName: 'Opening Ceremony',
    timestamp: toISODateTime(new Date('24 November 2021 16:00:00.000+00:00')),
  },
  // Media Day
  {
    eventName: 'Game 1',
    timestamp: toISODateTime(new Date('26 November 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'Game 2',
    timestamp: toISODateTime(new Date('27 November 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'Game 3',
    timestamp: toISODateTime(new Date('28 November 2021 12:30:00.000+00:00')),
  },
  // Free day
  {
    eventName: 'Game 4',
    timestamp: toISODateTime(new Date('30 November 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'Game 5',
    timestamp: toISODateTime(new Date('01 December 2021 12:30:00.000+00:00')),
  },
  // Free Day
  {
    eventName: 'Game 6',
    timestamp: toISODateTime(new Date('03 December 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'Game 7',
    timestamp: toISODateTime(new Date('04 December 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'Game 8',
    timestamp: toISODateTime(new Date('05 December 2021 12:30:00.000+00:00')),
  },
  // Free Day
  {
    eventName: 'Game 9',
    timestamp: toISODateTime(new Date('07 December 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'Game 10',
    timestamp: toISODateTime(new Date('08 December 2021 12:30:00.000+00:00')),
  },
  // Free Day
  {
    eventName: 'Game 11',
    timestamp: toISODateTime(new Date('10 December 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'Game 12',
    timestamp: toISODateTime(new Date('11 December 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'Game 13',
    timestamp: toISODateTime(new Date('12 December 2021 12:30:00.000+00:00')),
  },
  // Free Day
  {
    eventName: 'Game 14',
    timestamp: toISODateTime(new Date('14 December 2021 12:30:00.000+00:00')),
  },
];
