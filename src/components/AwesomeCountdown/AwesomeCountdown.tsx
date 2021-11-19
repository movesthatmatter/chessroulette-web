import React, { useState, useMemo, useCallback } from 'react';
import dateFormat from 'dateformat';
import { ISODateTime } from 'io-ts-isodatetime';
import { useInterval } from 'src/lib/hooks';
import { createUseStyles } from 'src/lib/jss';
import { Date } from 'window-or-global';
import { second } from 'src/lib/time';

type Props = {
  deadline: ISODateTime;
  fontSizePx?: number;
};

const getTimeLeft = (deadline: ISODateTime) => new Date(deadline).getTime() - new Date().getTime();
const interval = 1 * 1000;

export const AwesomeCountdown: React.FC<Props> = ({ deadline, fontSizePx = 60 }) => {
  const cls = useStyles();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline));

  const updateTimeLeft = useCallback(() => {
    setTimeLeft(getTimeLeft(deadline));
  }, [deadline]);

  useInterval(updateTimeLeft, second());

  const { days, hours, minutes, seconds } = useMemo(
    () =>
      ({
        days: dateFormat(timeLeft, 'dd'),
        hours: dateFormat(timeLeft, 'HH'),
        minutes: dateFormat(timeLeft, 'MM'),
        seconds: dateFormat(timeLeft, 'ss'),
      } as const),
    [timeLeft]
  );

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
