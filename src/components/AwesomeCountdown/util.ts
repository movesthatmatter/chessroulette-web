import {
  second as secondMs,
  days as daysMs,
  hours as hoursMs,
  minutes as minutesMs,
} from 'src/lib/time';
import duration from 'format-duration-time';
import { console } from 'window-or-global';

export const timeLeftToTimeUnits = (timeLeftMs: number) => {
  // const daysPortion = timeLeftMs;
  // const hoursPortion = timeLeftMs 

  const daysLeftMs = Math.floor(timeLeftMs / daysMs(1));
  const hoursLeftMs = Math.floor((timeLeftMs - daysLeftMs) / hoursMs(1));
  const minutesLeftMs = Math.floor((timeLeftMs - daysLeftMs - hoursLeftMs) / minutesMs(1));
  const secondsLeftMs = Math.floor(
    // timeLeftMs % secondMs(),
    (timeLeftMs - daysLeftMs - hoursLeftMs - minutesLeftMs) / secondMs()
  );
  
  console.log('all', timeLeftMs, daysLeftMs, hoursLeftMs, minutesLeftMs);
  console.log('seconds', timeLeftMs, secondMs(), secondsLeftMs);

  // const days = duration(daysLeftMs).format('dd');
  // const hours = duration(hoursLeftMs).format('hh');
  // const minutes = duration(minutesLeftMs).format('mm');
  // const seconds = duration(secondsLeftMs).format('ss');
  const days = daysLeftMs;
  const hours = hoursLeftMs;
  const minutes = minutesLeftMs;
  const seconds = secondsLeftMs;

  return {
    days,
    hours,
    minutes,
    seconds,
  } as const;
};
