import { addSeconds } from 'date-fns';
import { ISODateTime, toISODateTime } from 'io-ts-isodatetime';
import { now } from 'src/lib/date';

export type ScheduledEvent = {
  eventName: string;
  timestamp: ISODateTime;
};

// https://www.chess.com/events/2021-fide-world-chess-championship/schedule
export const HARDCODED_WCC_Schedule_Sorted: ScheduledEvent[] = [
  {
    eventName: 'WCC Opening Ceremony',
    timestamp: toISODateTime(new Date('24 November 2021 16:00:00.000+00:00')),
  },
  // Media Day
  {
    eventName: 'WCC Game 1',
    timestamp: toISODateTime(new Date('26 November 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 2',
    timestamp: toISODateTime(new Date('27 November 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 3',
    timestamp: toISODateTime(new Date('28 November 2021 12:30:00.000+00:00')),
  },
  // Free day
  {
    eventName: 'WCC Game 4',
    timestamp: toISODateTime(new Date('30 November 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 5',
    timestamp: toISODateTime(new Date('01 December 2021 12:30:00.000+00:00')),
  },
  // Free Day
  {
    eventName: 'WCC Game 6',
    timestamp: toISODateTime(new Date('03 December 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 7',
    timestamp: toISODateTime(new Date('04 December 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 8',
    timestamp: toISODateTime(new Date('05 December 2021 12:30:00.000+00:00')),
  },
  // Free Day
  {
    eventName: 'WCC Game 9',
    timestamp: toISODateTime(new Date('07 December 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 10',
    timestamp: toISODateTime(new Date('08 December 2021 12:30:00.000+00:00')),
  },
  // Free Day
  {
    eventName: 'WCC Game 11',
    timestamp: toISODateTime(new Date('10 December 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 12',
    timestamp: toISODateTime(new Date('11 December 2021 12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 13',
    timestamp: toISODateTime(new Date('12 December 2021 12:30:00.000+00:00')),
  },
  // Free Day
  {
    eventName: 'WCC Game 14',
    timestamp: toISODateTime(new Date('14 December 2021 12:30:00.000+00:00')),
  },
].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

export const getNextScheduledEvent = async (
  fromDate: Date
): Promise<ScheduledEvent | undefined> => {
  return HARDCODED_WCC_Schedule_Sorted.find((event) => {
    return new Date(event.timestamp).getTime() > fromDate.getTime();
  });
};
