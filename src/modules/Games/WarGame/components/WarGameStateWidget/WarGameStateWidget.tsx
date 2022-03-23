import { ChessGameColor } from 'chessroulette-io';
import { otherChessColor } from 'chessroulette-io/dist/chessGame/util/util';
import React, { useCallback, useMemo } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { WarGame } from 'src/modules/Games/types';
import { RoomWarGameParticipantsByColor } from 'src/modules/Room/RoomActivity/activities/WarGameActivity/types';
import { useGameTimesLeftByColor } from './useWarGameState';
import { roomWarGameActivityParticipantToWarGamePlayer } from 'src/modules/Room/RoomActivity/activities/WarGameActivity/utils';
import { getPlayerByColor } from 'src/modules/Games/Chess/lib';
import { fonts } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';
import { WarGamePlayerBox } from '../PlayerBox/PlayerBox';
import { FloatingBox } from 'src/components/FloatingBox';

type Props = {
  game: WarGame;
  onTimerFinished?: (color: ChessGameColor) => void;
  homeColor: ChessGameColor;
  participants?: RoomWarGameParticipantsByColor;
  containerClassName?: string;
  floatingBoxClassName?: string;
};

export const WarGameSateWidget: React.FC<Props> = ({
  game,
  participants,
  homeColor,
  onTimerFinished = noop,
  ...props
}) => {
  const cls = useStyles();

  const awayColor = useMemo(() => otherChessColor(homeColor), [homeColor]);
  const timeLeft = useGameTimesLeftByColor(game, [homeColor]);
  const players = useMemo(
    () =>
      ({
        white: participants
          ? roomWarGameActivityParticipantToWarGamePlayer(participants.white)
          : getPlayerByColor(homeColor, game.players),
        black: participants
          ? roomWarGameActivityParticipantToWarGamePlayer(participants.black)
          : getPlayerByColor(otherChessColor(homeColor), game.players),
      } as const),
    [participants]
  );

  const onTimerFinishedAway = useCallback(() => onTimerFinished(awayColor), [
    awayColor,
    onTimerFinished,
  ]);
  const onTimerFinishedHome = useCallback(() => onTimerFinished(homeColor), [
    homeColor,
    onTimerFinished,
  ]);

  return (
    <div className={cx(cls.container, props.containerClassName)}>
      <div className={cx(cls.player, cls.playerTop)}>
        <WarGamePlayerBox
          key={`pb-${players[awayColor].user.id}`}
          player={players[awayColor]}
          timeLeft={timeLeft[awayColor]}
          active={game.state === 'started' && game.lastMoveBy === homeColor}
          gameTimeLimitClass={game.timeLimit}
          onTimerFinished={onTimerFinishedAway}
        />
        <div className={cls.spacer} />
      </div>
      <FloatingBox className={cx(cls.gameStateContainer, props.floatingBoxClassName)}></FloatingBox>
      <div className={cls.player}>
        <div className={cls.spacer} />
        <WarGamePlayerBox
          key={`pb-${players[homeColor].user.id}`}
          player={players[homeColor]}
          timeLeft={timeLeft[homeColor]}
          active={game.state === 'started' && game.lastMoveBy === awayColor}
          gameTimeLimitClass={game.timeLimit}
          onTimerFinished={onTimerFinishedHome}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  gameStateContainer: {
    height: 'calc(100% - 80px)',
    minHeight: '100px',
    minWidth: '130px',
  },
  player: {},
  playerTop: {},
  gameStatus: {
    ...fonts.small2,
  },
  spacer: {
    height: spacers.small,
  },
});
