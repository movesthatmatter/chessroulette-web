import { days, hours, seconds } from 'src/lib/time';
import { Date } from 'window-or-global';
import { timeLeftToTimeUnits } from '../util';

const now = () => new Date();
const addMs = (date: Date, ms: number) => new Date(new Date().getTime() + ms);
const addMsFromNow = (ms: number) => addMs(now(), ms);
const diff = (a: Date, b: Date) => b.getTime() - a.getTime();
const diffFromNow = (a: Date) => a.getTime() - now().getTime();

test('seconds', () => {
  const actual = timeLeftToTimeUnits(diffFromNow(addMsFromNow(seconds(10))));

  expect(actual).toEqual({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 10,
  });
});

test('minutes & seconds', () => {
  const actual = timeLeftToTimeUnits(diffFromNow(addMsFromNow(seconds(61))));

  expect(actual).toEqual({
    days: 0,
    hours: 0,
    minutes: 1,
    seconds: 1,
  });
});

test('hours & minutes & seconds', () => {
  const actual = timeLeftToTimeUnits(diffFromNow(addMsFromNow(hours(1) + seconds(61))));

  expect(actual).toEqual({
    days: 0,
    hours: 1,
    minutes: 1,
    seconds: 1,
  });
});

test('days & hours & minutes & seconds', () => {
  const actual = timeLeftToTimeUnits(diffFromNow(addMsFromNow(days(1) + hours(1) + seconds(61))));

  expect(actual).toEqual({
    days: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
  });
});
