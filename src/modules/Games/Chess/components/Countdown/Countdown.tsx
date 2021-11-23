import React, { useState, useEffect, useMemo } from 'react';
import { noop } from 'src/lib/util';
import cx from 'classnames';
import dateFormat from 'dateformat';
import { useInterval } from 'src/lib/hooks';
import { timeLeftToFormatMajor, timeLeftToFormatMinor, timeLeftToInterval } from './util';
import { minutes } from 'src/lib/time';
import { GameRecord } from 'dstnd-io';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { CountdownDisplay } from './CountdownDisplay';

type Props = {
  // TODO: this needs a refactoring
  //  as it should take te lsat move and total time in account
  //  that's all! and do any calculation here
  gameTimeClass: GameRecord['timeLimit'];
  timeLeft: number;
  active: boolean;
  onFinished?: () => void;
  className?: string;
  thumbnail? :boolean;
};

export const Countdown: React.FC<Props> = ({
  onFinished = () => noop,
  gameTimeClass,
  ...props
}) => {
  const [finished, setFinished] = useState(false as boolean);
  const [timeLeft, setTimeLeft] = useState(props.timeLeft);
  const [interval, setInterval] = useState(timeLeftToInterval(props.timeLeft));
  const [gameTimeClassInMs, setGameTimeClassInMs] = useState(
    chessGameTimeLimitMsMap[gameTimeClass]
  );

  useEffect(() => {
    setGameTimeClassInMs(chessGameTimeLimitMsMap[gameTimeClass]);
  }, [gameTimeClass]);

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

  const { major, minor, canShowMilliseconds } = useMemo(
    () =>
      ({
        major: dateFormat(timeLeft, timeLeftToFormatMajor(gameTimeClassInMs, timeLeft)),
        minor: dateFormat(timeLeft, timeLeftToFormatMinor(gameTimeClassInMs, timeLeft)),
        canShowMilliseconds: gameTimeClassInMs > minutes(1) && timeLeft < minutes(1),
      } as const),
    [timeLeft, gameTimeClassInMs]
  );

  return (
    <div className={props.className}>
      <CountdownDisplay
        minor={minor}
        major={major}
        active={props.active}
        timeLeft={timeLeft}
        canShowMilliseconds={canShowMilliseconds}
        thumbnail={props.thumbnail}
      />
    </div>
  );
};
