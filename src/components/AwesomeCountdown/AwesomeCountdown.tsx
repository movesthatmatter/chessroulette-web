import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ISODateTime } from 'io-ts-isodatetime';
import { useInterval } from 'src/lib/hooks';
import { createUseStyles } from 'src/lib/jss';
import { Date } from 'window-or-global';
import { second as secondMs } from 'src/lib/time';
import { noop } from 'src/lib/util';
import { lpad, timeLeftToTimeUnits } from './util';

type Props = {
  deadline: ISODateTime;
  fontSizePx?: number;
  onTimeEnded?: (interval: number) => void;
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

    if (timeLeft <= tickInterval) {
      setIsActive(false);
      onTimeEnded(tickInterval);
    } else {
      setIsActive(true);
    }

    setTimeLeftMs(timeLeft);
  }, [deadline]);

  useEffect(() => {
    const nextTimeLeftMs = getTimeLeftMs(deadline);
    setTimeLeftMs(nextTimeLeftMs);
    setIsActive(nextTimeLeftMs > 0);
  }, [deadline]);

  useInterval(updateTimeLeft, isActive ? tickInterval : undefined);

  const { days, hours, minutes, seconds } = useMemo(() => {
    const times = timeLeftToTimeUnits(timeLeftMs);

    return {
      days: lpad(times.days),
      hours: lpad(times.hours),
      minutes: lpad(times.minutes),
      seconds: lpad(times.seconds),
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

const useStyles = createUseStyles({
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
});
