import React from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { getBoardSize as getDefaultBoardSize } from 'src/modules/GameRoom/util';
import { Coundtdown } from 'src/modules/GameRoom/components/Countdown';
import { ChessGameState, ChessGameColor, ChessMove } from 'dstnd-io';
import { getPlayerByColor } from 'src/modules/GameRoomV2/util';
import { Avatar } from 'src/components/Avatar';
import { otherChessColor } from '../../util';
import { ChessGame, ChessGameProps } from '../ChessGame/ChessGame';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';

type Props = React.HTMLProps<HTMLDivElement> & {
  playable: boolean;
  game: ChessGameState;

  // The bottom side
  homeColor: ChessGameColor;

  onMove: ChessGameProps['onMove'];
  onTimerFinished?: () => void;

  getBoardSize?: (p: {screenWidth: number; screenHeight: number}) => number;
};

export const StandaloneChessGame: React.FunctionComponent<Props> = ({
  game,
  onMove = noop,
  onTimerFinished = noop,
  playable = false,
  getBoardSize = getDefaultBoardSize,
  ...props
}) => {
  const cls = useStyles();

  const myPlayer = game
    ? getPlayerByColor(props.homeColor, game.players)
    : undefined;
  const opponentPlayer = game
    ? getPlayerByColor(otherChessColor(props.homeColor), game.players)
    : undefined;

  const now = new Date();
  const myTimeLeft = game.state === 'started' && game.lastMoveBy !== props.homeColor
    ? game.timeLeft[props.homeColor] - (now.getTime() - new Date(game.lastMoveAt).getTime())
    : game.timeLeft[props.homeColor];
  const opponentTimeLeft = game.state === 'started' && game.lastMoveBy === props.homeColor
    ? game.timeLeft[otherChessColor(props.homeColor)] - (now.getTime() - new Date(game.lastMoveAt).getTime())
    : game.timeLeft[otherChessColor(props.homeColor)];

  return (
    <div className={cx([cls.container, props.className])}>
      {opponentPlayer && game && (
        <div className={cx([cls.playerBar, cls.playerBarTop])}>
          <div className={cls.playerBarContent}>
            <div className={cls.playerInfo}>
              <Avatar className={cls.avatar}>
                <Mutunachi mid={opponentPlayer.user.avatarId} />
              </Avatar>

              {opponentPlayer.user.name}
            </div>
            <Coundtdown
              key={String(game.timeLeft[opponentPlayer.color])}
              className={cls.countdown}
              timeLeft={opponentTimeLeft}
              paused={
                !game
                || game.state !== 'started'
                || game.lastMoved === otherChessColor(props.homeColor)
              }
              onFinished={onTimerFinished}
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
        playable={playable}
        getBoardSize={(p) => getBoardSize(p) - 100}
        onMove={onMove}
      />
      {myPlayer && (
        <div className={cx([cls.playerBar, cls.playerBarBottom])}>
          <div className={cls.playerBarContent}>
            <div className={cls.playerInfo}>
              <Avatar className={cls.avatar}>
                <Mutunachi mid={myPlayer.user.avatarId} />
              </Avatar>
              {myPlayer.user.name}
            </div>
            <Coundtdown
              key={String(game.timeLeft[myPlayer.color])}
              className={cls.countdown}
              timeLeft={myTimeLeft}
              paused={
                !game
                || game.state !== 'started'
                || game.lastMoved === props.homeColor
              }
              onFinished={onTimerFinished}
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
  playerInfo: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    marginRight: '14px',
  },
  countdown: {
    minWidth: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
