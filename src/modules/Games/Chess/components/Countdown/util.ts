import { GameRecord } from 'dstnd-io';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { minutes, hours, seconds, milliseconds, second } from 'src/lib/time';

export const timeLeftToFormatMajor = (
  timeClassMs: number,
  timeLeftMs: number,
) => {
  // If the time class is 1 minute or less then show the milliseconds
  if (timeClassMs <= minutes(1) && timeLeftMs < minutes(1)) {
    return 'ss';
  }

  if (timeLeftMs < hours(1)) {
    return 'M';
  }
  return 'H';
};

export const timeLeftToFormatMinor = (
  timeClassMs: number,
  timeLeftMs: number
) => {

  // If the time class is 1 minute or less then show the milliseconds
  if (timeClassMs <= minutes(1) && timeLeftMs <= minutes(1)) {
    return 'L';
  }

  if (timeLeftMs < hours(1)) {
    return 'ss';
  }
  return 'M';
};

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
