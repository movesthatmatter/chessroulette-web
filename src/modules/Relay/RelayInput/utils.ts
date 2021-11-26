import { minutes } from 'src/lib/time';
import { timeLeftToTimeUnits } from 'src/modules/Games/Chess/components/Countdown/util';
import { Math } from 'window-or-global';

export function getTimeInMinutesAndSeconds(timeMS: number): {minutes: number; seconds: number}{
  if (timeMS < minutes(1)) {
    return {minutes: 0, seconds: Math.floor(timeMS/1000)}
  }
  const min = Math.floor(timeMS/60000)
  return {
    minutes: min,
    seconds: +((timeMS % 60000) /1000).toFixed(0)
  }
}

export function getMinutesAndSecondsFromTimeLeft(timeMS: number): {minutes:number, seconds: number} {
  const times = timeLeftToTimeUnits(timeMS);
  if (times.hours > 0) {
    return  {
      minutes: times.hours * 60 + times.minutes,
      seconds: times.seconds
    }
  }

  return {
    minutes : times.minutes,
    seconds: times.seconds
  }
}