import { ChessGameColor } from 'dstnd-io';
import React from 'react';
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
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';

type Props = {
  game: Game;
  onTimerFinished?: (color: ChessGameColor) => void;
  homeColor: ChessGameColor;
  playParticipants: RoomPlayParticipantsByColor;
  containerClassName?: string;
  floatingBoxClassName?: string;
};

export const GameStateWidget: React.FC<Props> = ({
  game,
  playParticipants,
  homeColor,
  onTimerFinished = noop,
  ...props
}) => {
  const cls = useStyles();

  const awayColor = otherChessColor(homeColor);
  const timeLeft = useGameTimesLeftByColor(game);
  const players = {
    white: roomPlayActivityParticipantToChessPlayer(playParticipants.white),
    black: roomPlayActivityParticipantToChessPlayer(playParticipants.black),
  } as const;

  return (
    <div className={cx(cls.container, props.containerClassName)}>
      <div className={cx(cls.player, cls.playerTop)}>
        <PlayerBox
          key={`pb-${players[awayColor].user.id}`}
          player={players[awayColor]}
          timeLeft={timeLeft[awayColor]}
          active={game.state === 'started' && game.lastMoveBy === homeColor}
          gameTimeLimit={game.timeLimit}
          material={playParticipants[awayColor].materialScore}
          onTimerFinished={() => onTimerFinished(awayColor)}
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
          gameTimeLimit={game.timeLimit}
          material={playParticipants[homeColor].materialScore}
          onTimerFinished={() => onTimerFinished(homeColor)}
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
