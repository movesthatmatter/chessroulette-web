import { ChessGameColor } from 'dstnd-io';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { fonts } from 'src/theme';
import { PlayerBox } from '../PlayerBox/PlayerBox';
import cx from 'classnames';
import { noop } from 'src/lib/util';
import { Game } from 'src/modules/Games';
import { roomPlayActivityParticipantToChessPlayer } from 'src/modules/Room/RoomActivity/activities/PlayActivity';
import { PlayParticipants } from 'src/modules/Games/types';
import { useGameTimesLeft } from './useGameState';
import { ChessGameHistoryProvided } from '../GameHistory/ChessGameHistoryProvider/ChessGameHistoryProvided';
import { FloatingBox } from 'src/components/FloatingBox';
import { spacers } from 'src/theme/spacers';

type Props = {
  game: Game;
  onTimerFinished?: (color: ChessGameColor) => void;

  playParticipants: PlayParticipants;
  containerClassName?: string;
  floatingBoxClassName?: string;
};

export const GameStateWidget: React.FC<Props> = ({
  game,
  playParticipants,
  onTimerFinished = noop,
  ...props
}) => {
  const cls = useStyles();

  const homePlayer = roomPlayActivityParticipantToChessPlayer(playParticipants.home);
  const awayPlayer = roomPlayActivityParticipantToChessPlayer(playParticipants.away);

  const { away: awayTimeLeft, home: homeTimeLeft } = useGameTimesLeft(game, playParticipants);

  return (
    <div className={cx(cls.container, props.containerClassName)}>
      <div className={cx(cls.player, cls.playerTop)}>
        <PlayerBox
          player={awayPlayer}
          timeLeft={awayTimeLeft}
          active={game.state === 'started' && game.lastMoveBy !== awayPlayer.color}
          gameTimeLimit={game.timeLimit}
          material={playParticipants.away.materialScore}
          onTimerFinished={() => onTimerFinished(awayPlayer.color)}
        />
        <div className={cls.spacer} />
      </div>
      <FloatingBox className={cx(cls.gameStateContainer, props.floatingBoxClassName)}>
        <ChessGameHistoryProvided emptyContent="White to move!" />
      </FloatingBox>
      <div className={cls.player}>
        <div className={cls.spacer} />
        <PlayerBox
          player={homePlayer}
          timeLeft={homeTimeLeft}
          active={game.state === 'started' && game.lastMoveBy !== homePlayer.color}
          gameTimeLimit={game.timeLimit}
          material={playParticipants.home.materialScore}
          onTimerFinished={() => onTimerFinished(homePlayer.color)}
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
