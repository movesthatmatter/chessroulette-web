import { ChessGameColor } from 'dstnd-io';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme/effects';
import { colors, fonts } from 'src/theme';
import { PlayerBox } from '../PlayerBox/PlayerBox';
import cx from 'classnames';
import { noop } from 'src/lib/util';
import { Game } from 'src/modules/Games';
import { roomActivityParticipantToChessPlayer } from 'src/modules/Room/RoomActivity/activities/PlayActivity';
import { PlayParticipants } from 'src/modules/Games/types';
import { useGameTimesLeft } from './useGameState';
import { ChessGameHistoryProvided } from '../GameHistory/ChessGameHistoryProvider/ChessGameHistoryProvided';
import { getPlayerByColor } from '../../lib';
import { getOtherColor } from 'src/modules/LichessPlay/utils';
import { getRelativeMaterialScore } from './util';

type Props = {
  game: Game;
  onTimerFinished?: (color: ChessGameColor) => void;
  playParticipants?: PlayParticipants;
  homeColor: ChessGameColor;
};

export const GameStateWidget: React.FC<Props> = ({
  game,
  playParticipants,
  onTimerFinished = noop,
  homeColor = 'white'
}) => {
  const cls = useStyles();

  const homePlayer =playParticipants ? roomActivityParticipantToChessPlayer(playParticipants.home) : getPlayerByColor(homeColor, game.players);
  const awayPlayer =playParticipants ? roomActivityParticipantToChessPlayer(playParticipants.away) : getPlayerByColor(getOtherColor(homeColor), game.players);

  const { away: awayTimeLeft, home: homeTimeLeft } = useGameTimesLeft(game, homeColor, playParticipants);

  return (
    <div className={cls.container}>
      <div className={cx(cls.player, cls.playerTop)}>
        <PlayerBox
          player={awayPlayer}
          timeLeft={awayTimeLeft}
          active={game.state === 'started' && game.lastMoveBy !== awayPlayer.color}
          gameTimeLimit={game.timeLimit}
          material={playParticipants ? playParticipants.away.materialScore : getRelativeMaterialScore(game).black}
          onTimerFinished={() => onTimerFinished(awayPlayer.color)}
        />
        <div className={cls.spacer} />
      </div>
      <div className={cls.gameStateContainer}>
        <ChessGameHistoryProvided />
      </div>
      <div className={cls.player}>
        <div className={cls.spacer} />
        <PlayerBox
          player={homePlayer}
          timeLeft={homeTimeLeft}
          active={game.state === 'started' && game.lastMoveBy !== homePlayer.color}
          gameTimeLimit={game.timeLimit}
          material={playParticipants ? playParticipants.home.materialScore : getRelativeMaterialScore(game).white}
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
    background: colors.white,
    ...floatingShadow,
    ...softBorderRadius,
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
    height: '8px',
  },
});
