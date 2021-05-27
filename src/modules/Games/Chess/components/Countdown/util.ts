import { minutes, hours, seconds, second } from 'src/lib/time';

export const timeLeftToFormatMajor = (
  timeClassMs: number,
  timeLeftMs: number,
) => {
  if (timeLeftMs < hours(1)) {
    return 'MM';
  }

  return 'H';
};

export const timeLeftToFormatMinor = (
  timeClassMs: number,
  timeLeftMs: number
) => {
  if (timeLeftMs < hours(1)) {
    return 'ss';
  }

  return 'MM';
};

export const timeLeftToInterval = (timeLeftMs: number) => {
  if (timeLeftMs < minutes(1)) {
    return seconds(.5);
  }

  if (timeLeftMs < hours(1)) {
    return second();
  }
  return minutes(1);
};
