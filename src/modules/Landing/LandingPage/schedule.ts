import { ISODateTime, toISODateTime } from 'io-ts-isodatetime';

export type ScheduledEvent = {
  eventName: string;
  timestamp: ISODateTime;
};

// https://www.chess.com/events/2021-fide-world-chess-championship/schedule
export const HARDCODED_WCC_Schedule_Sorted: ScheduledEvent[] = [
  {
    eventName: 'WCC Opening Ceremony',
    timestamp: toISODateTime(new Date('2021-11-24T16:00:00.000+00:00')),
  },
  // Media Day
  {
    eventName: 'WCC Game 1',
    timestamp: toISODateTime(new Date('2021-11-26T12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 2',
    timestamp: toISODateTime(new Date('2021-11-27T12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 3',
    timestamp: toISODateTime(new Date('2021-11-28T12:30:00.000+00:00')),
  },
  // Free day
  {
    eventName: 'WCC Game 4',
    timestamp: toISODateTime(new Date('2021-11-30T12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 5',
    timestamp: toISODateTime(new Date('2021-12-01T12:30:00.000+00:00')),
  },
  // Free Day
  {
    eventName: 'WCC Game 6',
    timestamp: toISODateTime(new Date('2021-12-03T12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 7',
    timestamp: toISODateTime(new Date('2021-12-04T12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 8',
    timestamp: toISODateTime(new Date('2021-12-05T12:30:00.000+00:00')),
  },
  // Free Day
  {
    eventName: 'WCC Game 9',
    timestamp: toISODateTime(new Date('2021-12-07T12:30:00.000+00:00')),
  },
  {
    eventName: 'WCC Game 10',
    timestamp: toISODateTime(new Date('2021-12-08T12:30:00.000+00:00')),
  },
  // Free Day
  {
    eventName: 'WCC Game 11',
    timestamp: toISODateTime(new Date('2021-12-10T12:30:00.000+00:00')),
  },
  // {
  //   eventName: 'WCC Game 12',
  //   timestamp: toISODateTime(new Date('2021-12-11T12:30:00.000+00:00')),
  // },
  // {
  //   eventName: 'WCC Game 13',
  //   timestamp: toISODateTime(new Date('2021-12-12T12:30:00.000+00:00')),
  // },
  // // Free Day
  // {
  //   eventName: 'WCC Game 14',
  //   timestamp: toISODateTime(new Date('2021-12-14T12:30:00.000+00:00')),
  // },
].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

export const getNextScheduledEvent = async (
  fromDate: Date
): Promise<ScheduledEvent | undefined> => {
  return HARDCODED_WCC_Schedule_Sorted.find((event) => {
    return new Date(event.timestamp).getTime() > fromDate.getTime();
  });
};
