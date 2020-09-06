import React, { useEffect, useState } from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Move, Square } from 'chess.js';
import { getBoardSize as getDefaultBoardSize } from 'src/modules/GameRoom/util';
import { ChessMove, ChessGameStatePgn } from 'dstnd-io';
import { ChessBoard } from '../ChessBoard';
import { getNewChessGame } from '../../lib/sdk';
import validMoveSound from '../../assets/sounds/valid_move.wav';
import inCheckSound from '../../assets/sounds/in_check.wav';
import { getSquareForPiece } from '../../lib/util';

const validMoveAudio = new Audio(validMoveSound);
const inCheckAudio = new Audio(inCheckSound);

type Props = React.HTMLProps<HTMLDivElement> & {
  playable: boolean;
  onMove?: (m: ChessMove, pgn: ChessGameStatePgn) => void;
  pgn: string;

  // If true the move will be snappy since it doesn't wait
  //  for the entire state to update (over the network) before
  //  rendering the move. Instead it renders it on drag which is
  //  much more natural!
  maintainPositionLocally?: boolean;

  // The bottom side
  homeColor: 'white' | 'black';

  getBoardSize?: (p: {screenWidth: number; screenHeight: number}) => number;
};

export const ChessGame: React.FunctionComponent<Props> = ({
  onMove = noop,
  pgn = '',
  playable = false,
  getBoardSize = getDefaultBoardSize,
  maintainPositionLocally = true,
  ...props
}) => {
  const cls = useStyles();
  const [gameInstance] = useState(getNewChessGame());
  const [fen, setFen] = useState(gameInstance.fen);
  const [history, setHistory] = useState([] as Move[]);
  const [inCheckSquare, setInCheckSquare] = useState<Square | undefined>();

  useEffect(() => {
    const validPgn = gameInstance.load_pgn(pgn);
    setFen(gameInstance.fen());
    setHistory(gameInstance.history({ verbose: true }));

    setInCheckSquare(undefined);

    // This shouldn't be here
    if (gameInstance.in_check()) {
      setInCheckSquare(getSquareForPiece(pgn, { color: gameInstance.turn(), type: 'k' }));

      inCheckAudio.play();
    } else if (validPgn) {
      validMoveAudio.play();
    }
  }, [pgn]);

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

    const nextMove: ChessMove = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // TODO: don't hardcode the queen
    };

    // see if the move is legal
    const validMove = gameInstance.move(nextMove);

    if (validMove !== null) {
      // onMove(gameInstance.pgn());
      onMove(nextMove, gameInstance.pgn());

      if (maintainPositionLocally) {
        setFen(gameInstance.fen());
      }
    }
  };

  return (
    <div className={cx([cls.container, props.className])}>
      <ChessBoard
        orientation={props.homeColor}
        position={fen}
        history={history}
        calcWidth={getBoardSize}
        darkSquareStyle={{
          backgroundColor: '#6792B4',
        }}
        lightSquareStyle={{
          backgroundColor: '#D7D7D7',
        }}
        onSquareClickMove={onMoveHandler}
        onDrop={onMoveHandler}
        inCheckSquare={inCheckSquare}

      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    backgroundColor: '#272729',
    boxShadow: '1px 1px 20px rgba(20, 20, 20, 0.27)',
    borderRadius: '3px',
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
  },
});
