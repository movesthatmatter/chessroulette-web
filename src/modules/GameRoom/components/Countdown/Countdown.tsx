import React, { useState, useEffect } from 'react';
import { prettyCountdown } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';

type Props = {
  timeLeft: number;
  paused: boolean;
  interval?: number;
};

export const Coundtdown: React.FC<Props> = ({
  interval = 1000,
  ...props
}) => {
  const cls = useStyles();
  const [timeLeft, setTimeLeft] = useState(props.timeLeft);

  useEffect(() => {
    if (!props.paused) {
      const token = setInterval(() => {
        setTimeLeft((prev) => prev - interval);
      }, interval);
      setTimeLeft((prev) => prev - (1 * 1000));

      return () => {
        clearInterval(token);
      };
    }

    return () => undefined;
  }, [props.paused]);

  useEffect(() => {
    setTimeLeft(props.timeLeft);
  }, [props.timeLeft]);

  return (
    <div className={cx(cls.container, {
      [cls.active]: !props.paused,
    })}
    >
      <span>{prettyCountdown(timeLeft, {})}</span>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  active: {
    background: 'rgba(255, 255, 0, .4)',
  },
});
