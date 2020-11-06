import React, { useState, useEffect } from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import dateFormat from 'dateformat';
import { useInterval } from 'src/lib/hooks';
import { Text } from 'src/components/Text';
import { timeLeftToFormatMajor, timeLeftToFormatMinor, timeLeftToInterval } from './util';
import { text } from 'src/theme/text';

type Props = {
  timeLeft: number;
  active: boolean;
  onFinished?: () => void;
  className?: string;
};

export const Coundtdown: React.FC<Props> = ({ onFinished = () => noop, ...props }) => {
  const cls = useStyles();
  const [finished, setFinished] = useState(false as boolean);
  const [timeLeft, setTimeLeft] = useState(props.timeLeft);
  const [interval, setInterval] = useState(timeLeftToInterval(props.timeLeft));

  useInterval(
    () => {
      setTimeLeft((prev) => prev - interval);
    },
    finished || !props.active ? undefined : interval
  );

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

  const clock = (
    <>
      {timeLeft > 0 ? (
        <Text className={cls.text}>
          <Text className={cx(cls.text, cls.major, props.active && cls.textActive)}>
            {dateFormat(timeLeft, timeLeftToFormatMajor(timeLeft))}
          </Text>
          <Text className={cx(cls.text, cls.minor, props.active && cls.textActive)}>
            {dateFormat(timeLeft, timeLeftToFormatMinor(timeLeft))}
          </Text>
        </Text>
      ) : (
        <Text className={cx(cls.text)}>
          <Text className={cx(cls.text, cls.major)}>0</Text>
          <Text className={cx(cls.text, cls.minor)}>00</Text>
        </Text>
      )}
    </>
  );

  return <div className={cx(cls.container, props.className)}>{clock}</div>;
};

const useStyles = createUseStyles({
  container: {},
  text: {
    fontSize: '32px',
    lineHeight: '32px',
    color: text.disabledColor,
  },
  textActive: {
    color: text.primaryColor,
  },
  major: {
    fontWeight: 700,
  },
  minor: {
    fontWeight: 300,
  },
  paused: {},
});
