import { ChessGameColor, ChessGameState } from 'dstnd-io';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { getPlayerByColor } from 'src/modules/GameRoomV2/util';
import { floatingShadow, softBorderRadius } from 'src/theme/effects';
import { otherChessColor } from '../../util';
import { colors, fonts } from 'src/theme';
import { PlayerBox } from './components/PlayerBox/PlayerBox';
import { GameHistory } from './components/GameHistory';
import cx from 'classnames';
import { getRelativeMaterialScore } from './util';

type Props = {
  game: ChessGameState;
  homeColor: ChessGameColor;
};

export const GameStateWidget: React.FC<Props> = ({ game, homeColor }) => {
  const cls = useStyles();

  const myPlayer = game ? getPlayerByColor(homeColor, game.players) : undefined;
  const opponentPlayer = game
    ? getPlayerByColor(otherChessColor(homeColor), game.players)
    : undefined;

  const now = new Date();
  const myTimeLeft =
    game.state === 'started' && game.lastMoveBy !== homeColor
      ? game.timeLeft[homeColor] - (now.getTime() - new Date(game.lastMoveAt).getTime())
      : game.timeLeft[homeColor];
  const opponentTimeLeft =
    game.state === 'started' && game.lastMoveBy === homeColor
      ? game.timeLeft[otherChessColor(homeColor)] -
        (now.getTime() - new Date(game.lastMoveAt).getTime())
      : game.timeLeft[otherChessColor(homeColor)];

  const materialScore = getRelativeMaterialScore(game.captured);

  // TODO: Oct 29th
  //  The GameState shouldn't have a timeLeft anymore since now those calcs happen on the client (above)!

  return (
    <div className={cls.container}>
      <div className={cx(cls.player, cls.playerTop)}>
        {opponentPlayer && (
          <>
            <PlayerBox
              player={opponentPlayer}
              timeLeft={opponentTimeLeft}
              active={game.state === 'started' && game.lastMoved !== opponentPlayer.color}
              gameTimeLimit={game.timeLimit}
              material={materialScore[opponentPlayer.color]}
            />
            <div className={cls.spacer} />
          </>
        )}
      </div>
      <div className={cls.gameStateContainer}>
        <GameHistory game={game} />
      </div>
      <div className={cls.player}>
        {myPlayer && (
          <>
            <div className={cls.spacer} />
            <PlayerBox
              player={myPlayer}
              timeLeft={myTimeLeft}
              active={game.state === 'started' && game.lastMoved !== myPlayer.color}
              gameTimeLimit={game.timeLimit}
              material={materialScore[myPlayer.color]}
            />
          </>
        )}
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
