import React, { useState, useEffect } from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import dateFormat from 'dateformat';
import {
  minutes, hours, seconds, milliseconds, second,
} from 'src/lib/time';
import { useInterval } from 'src/lib/hooks';

type Props = {
  timeLeft: number;
  paused: boolean;

  className?: string;
  activeClassName?: string;
  finishedClassName?: string;

  onFinished?: () => void;
};

const timeLeftToFormat = (timeLeftMs: number) => {
  if (timeLeftMs < seconds(10)) {
    return 'ss:l';
  }
  if (timeLeftMs < minutes(1)) {
    return 'ss:L';
  }
  if (timeLeftMs < hours(1)) {
    return 'M:ss';
  }
  return 'H:M';
};

const timeLeftToInterval = (timeLeftMs: number) => {
  if (timeLeftMs < seconds(10)) {
    return milliseconds(10);
  }
  if (timeLeftMs < minutes(1)) {
    return milliseconds(100);
  }
  if (timeLeftMs < hours(1)) {
    return second();
  }
  return minutes(1);
};

export const Coundtdown: React.FC<Props> = ({
  onFinished = () => noop,
  ...props
}) => {
  const cls = useStyles();
  const [finished, setFinished] = useState(false as boolean);
  const [timeLeft, setTimeLeft] = useState(props.timeLeft);
  const [interval, setInterval] = useState(timeLeftToInterval(props.timeLeft));

  useInterval(() => {
    setTimeLeft((prev) => prev - interval);
  }, (finished || props.paused) ? undefined : interval);

  useEffect(() => {
    setTimeLeft(props.timeLeft);
  }, [props.timeLeft]);

  useEffect(() => {
    setInterval(timeLeftToInterval(timeLeft));

    if (timeLeft <= 0) {
      setFinished(true);
      onFinished();
    }
  }, [timeLeft]);

  return (
    <div className={cx(cls.container, props.className, {
      [props.activeClassName || '']: !(props.paused || finished),
      [props.finishedClassName || '']: finished,
    })}
    >
      <span>{timeLeft > 0 ? dateFormat(timeLeft, timeLeftToFormat(timeLeft)) : '0:00'}</span>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});
