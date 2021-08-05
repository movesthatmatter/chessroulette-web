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

export const doubleDigitFormat = (int: number): string => {
  if (int < 10) {
    return `0${int}`
  } else {
    return int.toString()
  }
}

export const timerHours = (int: number): string => {
  const hours = Math.floor((int / (1000 * 60 * 60)) % 24)
  return hours.toString()
}

export const timerMinutes = (int: number): string => {
  const minutes = Math.floor((int / (1000 * 60)) % 60)
  return doubleDigitFormat(minutes)
}

export const timerSeconds = (int: number): string => {
  const seconds = Math.floor((int / 1000) % 60)
  return doubleDigitFormat(seconds)
}
