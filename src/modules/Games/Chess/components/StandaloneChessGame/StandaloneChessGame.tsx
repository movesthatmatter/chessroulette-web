import React from 'react';
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
  game: ChessGameState | undefined;

  // The bottom side
  homeColor: 'white' | 'black';

  onMove: (pgn: string) => void;
  onTimerFinished: () => void;

  getBoardSize?: (p: {screenWidth: number; screenHeight: number}) => number;
};

export const StandaloneChessGame: React.FunctionComponent<Props> = ({
  game,
  onMove = noop,
  playable = false,
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
              onFinished={props.onTimerFinished}
              activeClassName={cx({
                [cls.activeCountdownTurn]: game?.lastMoveBy === props.homeColor,
              })}
              finishedClassName={cls.finishedCountdown}
            />
          </div>
        </div>
      )}
      <ChessGame
        homeColor={props.homeColor}
        pgn={game?.pgn ?? ''}
        playable={playable && game?.state !== 'finished'}
        getBoardSize={(p) => getBoardSize(p) - 100}
        onMove={onMove}
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
              onFinished={props.onTimerFinished}
              activeClassName={cx({
                [cls.activeCountdownTurn]: game?.lastMoveBy !== props.homeColor,
              })}
              finishedClassName={cls.finishedCountdown}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
  },
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
  activeCountdownTurn: {
    color: 'white',
    backgroundColor: 'rgb(247, 98, 123) !important',
    boxShadow: '1px 1px 15px rgba(20, 20, 20, 0.27)',
  },
  finishedCountdown: {
    color: 'white',
    backgroundColor: 'red !important',
    boxShadow: '1px 1px 15px rgba(20, 20, 20, 0.27)',
  },
});
