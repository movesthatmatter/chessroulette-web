import React, { useEffect, useState } from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Move, Square } from 'chess.js';
import { getBoardSize as getDefaultBoardSize } from 'src/modules/GameRoom/util';
import { Coundtdown } from 'src/modules/GameRoom/components/Countdown';
import { ChessBoard } from '../ChessBoard';
import { getNewChessGame } from '../../lib/sdk';
import { ChessGameState } from '../../records';
import { otherChessColor } from '../../util';

type Props = React.HTMLProps<HTMLDivElement> & {
  playable: boolean;
  onMove?: (pgn: string) => void;
  // pgn: string;
  game: ChessGameState | undefined;

  // The bottom side
  homeColor: 'white' | 'black';

  getBoardSize?: (p: {screenWidth: number; screenHeight: number}) => number;
};

export const ChessGameV2: React.FunctionComponent<Props> = ({
  game,
  onMove = noop,
  // pgn = '',
  playable = true,
  // boardSize =
  getBoardSize = getDefaultBoardSize,
  ...props
}) => {
  const cls = useStyles();
  const [gameInstance] = useState(getNewChessGame());
  const [fen, setFen] = useState(gameInstance.fen);
  const [history, setHistory] = useState([] as Move[]);

  useEffect(() => {
    if (game && game.pgn) {
      gameInstance.load_pgn(game.pgn);
      setFen(gameInstance.fen());
      setHistory(gameInstance.history({ verbose: true }));
    }
  }, [game]);

  const onMoveHandler = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: Square;
    targetSquare: Square;
  }) => {
    if (!playable) {
      return;
    }

    // see if the move is legal
    const validMove = gameInstance.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // keep it simple for now
    });

    if (validMove !== null) {
      // save it here too so it's snappy fast
      setFen(gameInstance.fen());
      onMove(gameInstance.pgn());
    }
  };

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
      <div className={cls.board}>
        <ChessBoard
          orientation={props.homeColor}
          position={fen}
          calcWidth={(p) => getBoardSize(p) - 100} // account for the top and bottom bars
          history={history}
          darkSquareStyle={{
            backgroundColor: '#6792B4',
          }}
          lightSquareStyle={{
            backgroundColor: '#D7D7D7',
          }}
          onSquareClickMove={onMoveHandler}
          onDrop={onMoveHandler}
        />
      </div>
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
  board: {
    boxShadow: '1px 1px 20px rgba(20, 20, 20, 0.27)',
    borderRadius: '30px',
  },
  awayPlayer: {

  },
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
