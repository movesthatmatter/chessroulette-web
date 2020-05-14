import React, { useState, useEffect } from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import dateFormat from 'dateformat';

type Props = {
  timeLeft: number;
  paused: boolean;
  interval?: number;

  className?: string;
  activeClassName?: string;

  onFinished?: () => void;
};

export const Coundtdown: React.FC<Props> = ({
  interval = 1000,
  onFinished = () => noop,
  ...props
}) => {
  const cls = useStyles();
  const [finished, setFinished] = useState(false as boolean);
  const [timeLeft, setTimeLeft] = useState(props.timeLeft);

  useEffect(() => {
    if (finished) {
      return () => undefined;
    }

    if (!props.paused) {
      const token = setInterval(() => {
        setTimeLeft((prev) => prev - interval);
      }, interval);

      return () => {
        clearInterval(token);
      };
    }

    return () => undefined;
  }, [props.paused, finished]);

  useEffect(() => {
    setTimeLeft(props.timeLeft);
  }, [props.timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setFinished(true);
      onFinished();
    }
  }, [timeLeft]);

  return (
    <div className={cx(cls.container, props.className, {
      [props.activeClassName || '']: !props.paused,
    })}
    >
      <span>{timeLeft > 0 ? dateFormat(timeLeft, 'M:ss') : '0:00'}</span>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});
