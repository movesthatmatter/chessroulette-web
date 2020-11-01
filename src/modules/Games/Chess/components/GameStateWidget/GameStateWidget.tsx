import { ChessGameColor, ChessGameState } from 'dstnd-io';
import { Box, Text } from 'grommet';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { getPlayerByColor } from 'src/modules/GameRoomV2/util';
import { floatingShadow, softBorderRadius } from 'src/theme/effects';
import { otherChessColor } from '../../util';
import { fonts } from 'src/theme';
import { PlayerBox } from './components/PlayerBox/PlayerBox';
import { GameHistory } from './components/GameHistory';
import capitalize from 'capitalize';
import cx from 'classnames';
import { Emoji } from 'src/components/Emoji';

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

  // TODO: Oct 29th
  //  The GameState shouldn't have a timeLeft anymore since now those calcs happen on the client (above)!

  return (
    <Box className={cls.container}>
      <Box className={cx(cls.player, cls.playerTop)}>
        {opponentPlayer && (
          <PlayerBox
            player={opponentPlayer}
            timeLeft={opponentTimeLeft}
            active={game.state === 'started' && game.lastMoved !== opponentPlayer.color}
          />
        )}
      </Box>
      <Box
        className={cls.gameStateContainer}
        fill
        pad={{
          vertical: 'small',
          horizontal: 'medium',
        }}
      >
        {(game.state === 'started' || game.state === 'finished' || game.state === 'stopped') && (
          <GameHistory game={game} />
        )}
        {(game.state === 'finished' ||
          game.state === 'stopped' ||
          game.state === 'neverStarted' ||
          game.state === 'pending') && (
          <Box
            alignContent="center"
            justify="center"
            style={{
              flex: 1,
            }}
          >
            <Text size="small" className={cls.gameStatus} textAlign="center">
              {game.state === 'finished' && (
                <>
                  {game.winner === '1/2' ? (
                    'Game Ended in a Draw by Stalemate!'
                  ) : (
                    <>
                      {`${capitalize(game.winner)} won! `}
                      <Text size="medium">
                        <Emoji symbol="🎉" />
                      </Text>
                    </>
                  )}
                </>
              )}
              {game.state === 'stopped' && (
                <>
                  {game.winner === '1/2'
                    ? 'Game Ended in a Draw!'
                    : `${capitalize(otherChessColor(game.winner))} resigned!`}
                </>
              )}
              {game.state === 'neverStarted' && 'Game Aborted!'}
              {game.state === 'pending' && 'Game Not Started!'}
            </Text>
          </Box>
        )}
      </Box>
      <Box className={cls.player}>
        {myPlayer && (
          <PlayerBox
            player={myPlayer}
            timeLeft={myTimeLeft}
            active={game.state === 'started' && game.lastMoved !== myPlayer.color}
          />
        )}
      </Box>
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {
    height: '100%',
  },
  gameStateContainer: {
    background: 'white',
    ...floatingShadow,
    ...softBorderRadius,
    marginTop: '16px',
    marginBottom: '16px',
  },
  player: {},
  playerTop: {},
  gameStatus: {
    ...fonts.small2,
  },
});
