import React, { useState, useEffect, useMemo } from 'react';
import { noop } from 'src/lib/util';
import { useInterval } from 'src/lib/hooks';
import { lpad, timeLeftToInterval, timeLeftToTimeUnits } from './util';
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
  thumbnail?: boolean;
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

  const { major, minor, canShowMilliseconds } = useMemo(() => {
    const times = timeLeftToTimeUnits(timeLeft);

    if (times.hours > 0) {
      return {
        major: `${times.hours}h`,
        minor: `${lpad(times.hours)}`,
        canShowMilliseconds: false,
      };
    }

    return {
      major: lpad(times.minutes),
      minor: lpad(times.seconds),
      canShowMilliseconds: false,
    };
  }, [timeLeft, gameTimeClassInMs]);

  return (
    <div className={props.className}>
      <CountdownDisplay
        major={major}
        minor={minor}
        active={props.active}
        timeLeft={timeLeft}
        canShowMilliseconds={canShowMilliseconds}
        thumbnail={props.thumbnail}
      />
    </div>
  );
};
