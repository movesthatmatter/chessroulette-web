import React, { useState, useMemo, useCallback, useEffect } from 'react';
import dateFormat from 'dateformat';
import { ISODateTime } from 'io-ts-isodatetime';
import { useInterval } from 'src/lib/hooks';
import { createUseStyles } from 'src/lib/jss';
import { console, Date } from 'window-or-global';
import {
  second as secondMs,
  days as daysMs,
  hours as hoursMs,
  minutes as minutesMs,
} from 'src/lib/time';
import { noop } from 'src/lib/util';
import duration from 'format-duration-time';

type Props = {
  deadline: ISODateTime;
  fontSizePx?: number;
  onTimeEnded?: () => void;
};

const getTimeLeftMs = (deadline: ISODateTime) =>
  new Date(deadline).getTime() - new Date().getTime();
const tickInterval = secondMs();

export const AwesomeCountdown: React.FC<Props> = ({
  deadline,
  fontSizePx = 60,
  onTimeEnded = noop,
}) => {
  const cls = useStyles();
  const [timeLeftMs, setTimeLeftMs] = useState(getTimeLeftMs(deadline));
  const [isActive, setIsActive] = useState(timeLeftMs > 0);

  const updateTimeLeft = useCallback(() => {
    const timeLeft = getTimeLeftMs(deadline);
    console.log('timeleft', timeLeft);

    if (timeLeft <= tickInterval) {
      setIsActive(false);
      onTimeEnded();
    } else {
      setIsActive(true);
    }

    setTimeLeftMs(timeLeft);
  }, [deadline]);

  useEffect(() => {
    const nextTimeLeftMs = getTimeLeftMs(deadline);
    setTimeLeftMs(nextTimeLeftMs);
    setIsActive(nextTimeLeftMs > 0);

    console.log('daedline updated', deadline);
  }, [deadline])

  useInterval(updateTimeLeft, isActive ? tickInterval : undefined);

  const { days, hours, minutes, seconds } = useMemo(() => {
    // const daysLeft = Math.floor(timeLeftMs / daysMs(1));
    // const hoursLeft = Math.floor(timeLeftMs / hoursMs(1));
    // const minutesLeft = Math.floor(timeLeftMs / minutesMs(1));

    const daysLeftMs = Math.floor(timeLeftMs / daysMs(1));
    const hoursLeftMs = Math.floor((timeLeftMs - daysLeftMs) / hoursMs(1));
    const minutesLeftMs = Math.floor((timeLeftMs - daysLeftMs - hoursLeftMs) / minutesMs(1));
    const secondsLeftMs = Math.floor(
      (timeLeftMs - daysLeftMs - hoursLeftMs - minutesLeftMs) / secondMs()
    );

    const days = duration(daysLeftMs).format('dd');
    const hours = duration(hoursLeftMs).format('hh');
    const minutes = duration(minutesLeftMs).format('mm');
    const seconds = duration(secondsLeftMs).format('ss');

    return {
      days: dateFormat(timeLeftMs, 'dd'),
      hours: dateFormat(timeLeftMs, 'HH'),
      minutes: dateFormat(timeLeftMs, 'MM'),
      seconds: dateFormat(timeLeftMs, 'ss'),
    } as const;
  }, [timeLeftMs]);

  return (
    <div className={cls.container} style={{ fontSize: fontSizePx }}>
      <div className={cls.section}>
        <div className={cls.timeText}>{days}</div>
        <div className={cls.timeLabelText}>Days</div>
      </div>
      :
      <div className={cls.section}>
        <div className={cls.timeText}>{hours}</div>
        <div className={cls.timeLabelText}>Hours</div>
      </div>
      :
      <div className={cls.section}>
        <div className={cls.timeText}>{minutes}</div>
        <div className={cls.timeLabelText}>Minutes</div>
      </div>
      :
      <div className={cls.section}>
        <div className={cls.timeText}>{seconds}</div>
        <div className={cls.timeLabelText}>Seconds</div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {},
  timeText: {
    fontSize: '1em',
    display: 'flex',
    fontWeight: 'bold',
  },
  timeLabelText: {
    fontSize: '.25em',
    display: 'block',
    textAlign: 'center',
    textTransform: 'lowercase',
  },
}));
