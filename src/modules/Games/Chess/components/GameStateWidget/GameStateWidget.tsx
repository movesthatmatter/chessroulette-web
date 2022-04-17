import React, { useMemo, useCallback } from 'react';
import { ChessGameColor } from 'chessroulette-io';
import { createUseStyles } from 'src/lib/jss';
import { fonts } from 'src/theme';
import { PlayerBox } from '../PlayerBox/PlayerBox';
import cx from 'classnames';
import { noop } from 'src/lib/util';
import { Game } from 'src/modules/Games';
import {
  roomPlayActivityParticipantToChessPlayer,
  RoomPlayParticipantsByColor,
} from 'src/modules/Room/RoomActivity/activities/PlayActivity';
import { useGameTimesLeftByColor } from './useGameState';
import { ChessGameHistoryProvided } from '../GameHistory/ChessGameHistoryProvider/ChessGameHistoryProvided';
import { FloatingBox } from 'src/components/FloatingBox';
import { spacers } from 'src/theme/spacers';
import { otherChessColor } from 'chessroulette-io/dist/chessGame/util/util';
import { getPlayerByColor } from '../../lib';
import { getRelativeMaterialScore } from './util';

type Props = {
  game: Game;
  onTimerFinished?: (color: ChessGameColor) => void;
  homeColor: ChessGameColor;
  playParticipants?: RoomPlayParticipantsByColor;
  containerClassName?: string;
  floatingBoxClassName?: string;
};

export const GameStateWidget: React.FC<Props> = React.memo(
  ({ game, playParticipants, homeColor, onTimerFinished = noop, ...props }) => {
    const cls = useStyles();

    const awayColor = useMemo(() => otherChessColor(homeColor), [homeColor]);
    const timeLeft = useGameTimesLeftByColor(game, [homeColor]);
    const players = useMemo(
      () =>
        ({
          white: playParticipants ? roomPlayActivityParticipantToChessPlayer(playParticipants.white) : getPlayerByColor(homeColor, game.players),
          black: playParticipants ? roomPlayActivityParticipantToChessPlayer(playParticipants.black) : getPlayerByColor(otherChessColor(homeColor), game.players),
        } as const),
      [playParticipants]
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
          <PlayerBox
            key={`pb-${players[awayColor].user.id}`}
            player={players[awayColor]}
            timeLeft={timeLeft[awayColor]}
            active={game.state === 'started' && game.lastMoveBy === homeColor}
            gameTimeLimitClass={game.timeLimit}
            material={playParticipants ? playParticipants.black.materialScore : getRelativeMaterialScore(game).black}
            onTimerFinished={onTimerFinishedAway}
          />
          <div className={cls.spacer} />
        </div>
        <FloatingBox className={cx(cls.gameStateContainer, props.floatingBoxClassName)}>
          <ChessGameHistoryProvided emptyContent="White to move!" />
        </FloatingBox>
        <div className={cls.player}>
          <div className={cls.spacer} />
          <PlayerBox
            key={`pb-${players[homeColor].user.id}`}
            player={players[homeColor]}
            timeLeft={timeLeft[homeColor]}
            active={game.state === 'started' && game.lastMoveBy === awayColor}
            gameTimeLimitClass={game.timeLimit}
            material={playParticipants ? playParticipants.black.materialScore : getRelativeMaterialScore(game).white}
            onTimerFinished={onTimerFinishedHome}
          />
        </div>
      </div>
    );
  }
);

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
