import {
  minutes, hours, seconds, milliseconds, second,
} from 'src/lib/time';


export const timeLeftToFormatMajor = (timeLeftMs: number) => {
  if (timeLeftMs < seconds(10)) {
    return 'ss';
  }
  if (timeLeftMs < minutes(1)) {
    return 'ss';
  }
  if (timeLeftMs < hours(1)) {
    return 'M';
  }
  return 'H';
};

export const timeLeftToFormatMinor = (timeLeftMs: number) => {
  // if (timeLeftMs < seconds(10)) {
  //   return 'l';
  // }
  if (timeLeftMs < minutes(1)) {
    return 'l';
  }
  if (timeLeftMs < hours(1)) {
    return 'ss';
  }
  return 'M';
}

export const timeLeftToInterval = (timeLeftMs: number) => {
  // if (timeLeftMs < seconds(10)) {
  //   return milliseconds(10);
  // }
  if (timeLeftMs < minutes(1)) {
    return milliseconds(21);
  }
  if (timeLeftMs < hours(1)) {
    return second();
  }
  return minutes(1);
};