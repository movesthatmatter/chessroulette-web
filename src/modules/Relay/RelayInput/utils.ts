import { minutes } from 'src/lib/time';
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