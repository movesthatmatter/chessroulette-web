import React, { useState, useEffect } from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import cx from 'classnames';
import dateFormat from 'dateformat';
import { useInterval } from 'src/lib/hooks';
import { Text } from 'src/components/Text';
import { timeLeftToFormatMajor, timeLeftToFormatMinor, timeLeftToInterval } from './util';
import { CustomTheme, maxMediaQuery, onlyMobile } from 'src/theme';
import { minutes } from 'src/lib/time';
import { GameRecord } from 'dstnd-io';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';

type Props = {
  // TODO: this needs a refactoring
  //  as it should take te lsat move and total time in account
  //  that's all! and do any calculation here
  gameTimeClass: GameRecord['timeLimit'];
  timeLeft: number;
  active: boolean;
  onFinished?: () => void;
  className?: string;
};

export const Countdown: React.FC<Props> = ({ onFinished = () => noop, gameTimeClass, ...props }) => {
  const cls = useStyles();
  const [finished, setFinished] = useState(false as boolean);
  const [timeLeft, setTimeLeft] = useState(props.timeLeft);
  const [interval, setInterval] = useState(timeLeftToInterval(props.timeLeft));

  const gameTimeClassInMs = chessGameTimeLimitMsMap[gameTimeClass];

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
    }
  }, [timeLeft]);

  useEffect(() => {
    if (finished) {
      onFinished();
    }
  }, [finished]);

  const clock = (
    <>
      {timeLeft > 0 ? (
        <Text className={cls.text}>
          <Text
            className={cx(cls.text, cls.major, props.active && cls.textActive, {
              [cls.countdownMilliseconds]: gameTimeClassInMs > minutes(1) && timeLeft < minutes(1),
            })}
          >
            {dateFormat(timeLeft, timeLeftToFormatMajor(gameTimeClassInMs, timeLeft))}
          </Text>
          <Text className={cx(cls.text, cls.major, props.active && (cls.textActive, cls.blink), {
              [cls.countdownMilliseconds]: gameTimeClassInMs > minutes(1) && timeLeft < minutes(1),
            })}>:</Text>
          <Text
            className={cx(cls.text, cls.minor, props.active && cls.textActive, {
              [cls.countdownMilliseconds]: gameTimeClassInMs > minutes(1) && timeLeft < minutes(1),
            })}
          >
            {dateFormat(timeLeft, timeLeftToFormatMinor(gameTimeClassInMs, timeLeft))}
          </Text>
        </Text>
      ) : (
        <Text className={cx(cls.text, cls.countdownMilliseconds)}>
          <Text className={cx(cls.text, cls.major, cls.countdownMilliseconds)}>00:</Text>
          <Text className={cx(cls.text, cls.minor, cls.countdownMilliseconds)}>00</Text>
        </Text>
      )}
    </>
  );

  return <div className={cx(cls.container, props.className)}>{clock}</div>;
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {},
  text: {
    fontSize: '32px',
    lineHeight: '32px',
    color: theme.text.subtle,
    ...maxMediaQuery(1300, {
      fontSize: '24px',
      lineHeight: '24px',
    }),
    ...onlyMobile({
      fontSize: '24px',
      lineHeight: '24px',
    }),
  },
  textActive: {
    color: theme.text.baseColor,
  },
  major: {
    fontWeight: 700,
  },
  minor: {
    fontWeight: 300,
  },
  paused: {},
  countdownMilliseconds: {
    ...makeImportant({
      color: theme.colors.negative,
    }),
  },
  blink: {
    animation: '$blink 1s steps(5, start) infinite',
    color: theme.text.primaryColor,
  },
  '@keyframes blink': {
    ...{
      to: {
        visibility: 'hidden',
      }
    } as NestedCSSElement,
  },
}));
