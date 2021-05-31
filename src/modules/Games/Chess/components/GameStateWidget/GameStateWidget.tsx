import { ChessGameColor } from 'dstnd-io';
import React, { useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme/effects';
import { colors, fonts } from 'src/theme';
import { PlayerBox } from '../PlayerBox/PlayerBox';
import { GameHistory } from '../GameHistory';
import cx from 'classnames';
import { getRelativeMaterialScore } from './util';
import { Events } from 'src/services/Analytics';
import { noop } from 'src/lib/util';
import { Game } from 'src/modules/Games';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { getPlayerByColor } from '../../lib';

type Props = {
  game: Game;
  homeColor: ChessGameColor;
  historyFocusedIndex?: number;
  onHistoryFocusedIndexChanged?: (index: number) => void;
  onTimerFinished?: (color: ChessGameColor) => void;
};

export const GameStateWidget: React.FC<Props> = ({
  game,
  homeColor,
  onTimerFinished = noop,
  ...props
}) => {
  const cls = useStyles();

  useEffect(() => {
    if (!homePlayer) {
      return;
    }

    // TODO: This is a bit inaccurate dependeding on the state because a
    //  Page Refresh (not rerender which should not be counted twice for same value)
    //  will retrack!
    if (game.state === 'stopped' || game.state === 'finished') {
      Events.trackGameEnded(game.state);
    }
  }, [game.state]);

  const homePlayer = game ? getPlayerByColor(homeColor, game.players) : undefined;
  const awayPlayer = game
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
  const materialScore = getRelativeMaterialScore(game);

  return (
    <div className={cls.container}>
      <div className={cx(cls.player, cls.playerTop)}>
        {awayPlayer && (
          <>
            <PlayerBox
              player={awayPlayer}
              timeLeft={opponentTimeLeft}
              active={game.state === 'started' && game.lastMoveBy !== awayPlayer.color}
              gameTimeLimit={game.timeLimit}
              material={materialScore[awayPlayer.color]}
              onTimerFinished={() => onTimerFinished(awayPlayer.color)}
            />
            <div className={cls.spacer} />
          </>
        )}
      </div>
      <div className={cls.gameStateContainer}>
        <GameHistory
          game={game}
          focusedIndex={props.historyFocusedIndex}
          onFocusedIndexChanged={props.onHistoryFocusedIndexChanged}
        />
      </div>
      <div className={cls.player}>
        {homePlayer && (
          <>
            <div className={cls.spacer} />
            <PlayerBox
              player={homePlayer}
              timeLeft={myTimeLeft}
              active={game.state === 'started' && game.lastMoveBy !== homePlayer.color}
              gameTimeLimit={game.timeLimit}
              material={materialScore[homePlayer.color]}
              onTimerFinished={() => onTimerFinished(homePlayer.color)}
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
