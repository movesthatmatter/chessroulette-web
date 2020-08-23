import React, { useEffect, useState } from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { getBoardSize as getDefaultBoardSize } from 'src/modules/GameRoom/util';
import { Coundtdown } from 'src/modules/GameRoom/components/Countdown';
import { ChessGameState } from '../../records';
import { otherChessColor } from '../../util';
import { ChessGame } from '../ChessGame/ChessGame';

type Props = React.HTMLProps<HTMLDivElement> & {
  playable: boolean;
  onMove?: (pgn: string) => void;
  // pgn: string;
  game: ChessGameState | undefined;

  // The bottom side
  homeColor: 'white' | 'black';

  getBoardSize?: (p: {screenWidth: number; screenHeight: number}) => number;
};

export const StandaloneChessGame: React.FunctionComponent<Props> = ({
  game,
  onMove = noop,
  // pgn = '',
  playable = true,
  // boardSize =
  getBoardSize = getDefaultBoardSize,
  ...props
}) => {
  const cls = useStyles();

  return (
    <div className={cx([cls.container, props.className])}>
      {game && (
        <div className={cx([cls.playerBar, cls.playerBarTop])}>
          <div className={cls.playerBarContent}>
            <div className={cls.playerInfo}>
              {game?.players[otherChessColor(props.homeColor)].name}
            </div>

            <Coundtdown
              className={cls.countdown}
              timeLeft={game?.timeLeft?.[otherChessColor(props.homeColor)] ?? 0}
              paused={
                !game
                || game.state !== 'started'
                || game.lastMoved === otherChessColor(props.homeColor)
              }
            // onFinished={props.onTimeFinished}
            // activeClassName={cx({
            //   [cls.activeCountdownTurn]:
            //       props.currentGame
            //       && props.currentGame.lastMoved !== props.player.color,
            // })}
            />
          </div>
        </div>
      )}
      <ChessGame
        homeColor={props.homeColor}
        pgn={game?.pgn ?? ''}
        playable={playable}
        getBoardSize={(p) => getBoardSize(p) - 100}
      />
      {game && (
        <div className={cx([cls.playerBar, cls.playerBarBottom])}>
          <div className={cls.playerBarContent}>
            <div className={cls.playerInfo}>
              {game?.players[props.homeColor].name}
            </div>
            <Coundtdown
              className={cls.countdown}
              timeLeft={game?.timeLeft?.[props.homeColor] ?? 0}
              paused={
                !game
                || game.state !== 'started'
                || game.lastMoved === props.homeColor
              }
            // onFinished={props.onTimeFinished}
            // activeClassName={cx({
            //   [cls.activeCountdownTurn]:
            //       props.currentGame
            //       && props.currentGame.lastMoved !== props.player.color,
            // })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    // backgroundColor: '#272729',

    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
  },
  // board: {
  //   boxShadow: '1px 1px 20px rgba(20, 20, 20, 0.27)',
  //   borderRadius: '30px',
  // },
  awayPlayer: {},
  homePlayer: {},
  playerBar: {
    height: '40px',
    padding: '10px 0',
  },
  playerBarContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  playerBarTop: {
    paddingTop: '0px',
  },
  playerBarBottom: {
    paddingBottom: '0px',
  },
  playerInfo: {},
  countdown: {
    minWidth: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontFamily: 'Roboto',
    padding: '0 10px',
    height: '40px',

    backgroundColor: '#EFE7E8',
  },
});
