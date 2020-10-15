import Chessboard from 'chessboardjsx';
import React from 'react';
import { Move, Square } from 'chess.js';
import { CSSProperties } from 'src/lib/jss/types';
import { noop } from 'src/lib/util';

export type ChessBoardProps = Chessboard['props'] & {
  history: Move[];
  inCheckSquare?: Square;
  onSquareClickMove?: (props: { targetSquare: Square; sourceSquare: Square }) => void;
  onSquareClicked?: (sq: Square) => void;
  clickedSquareStyle: Partial<{ [sq in Square]: CSSProperties }>;
};

export const ChessBoard: React.FC<ChessBoardProps> = ({
  history,
  onSquareClickMove = noop,
  onSquareClicked = noop,
  inCheckSquare,
  clickedSquareStyle,
  ...boardProps
}) => {
  const lastMove = history[history.length - 1];
  const lastMoveStyle = lastMove
    ? {
        [lastMove.from]: { backgroundColor: 'rgba(255, 255, 0, .4)' },
        [lastMove.to]: { backgroundColor: 'rgba(255, 255, 0, .4)' },
      }
    : {};

  const inCheckStyle = {
    ...(inCheckSquare && {
      [inCheckSquare]: {
        backgroundColor: 'rgba(255, 0, 0, .4)',
      },
    }),
  };

  return (
    <Chessboard
      {...boardProps}
      squareStyles={{
        ...lastMoveStyle,
        ...clickedSquareStyle,
        ...inCheckStyle,
      }}
    />
  );
};
