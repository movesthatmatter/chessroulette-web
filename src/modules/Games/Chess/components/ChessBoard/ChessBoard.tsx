import Chessboard from 'chessboardjsx';
import React, { useState, useEffect } from 'react';
import { Move, Square } from 'chess.js';
import { CSSProperties } from 'src/lib/jss/types';
import { noop } from 'src/lib/util';

export type ChessBoardProps = Chessboard['props'] & {
  history: Move[];
  inCheckSquare?: Square;
  onSquareClickMove?: (props: {
    targetSquare: Square;
    sourceSquare: Square;
  }) => void;
};

export const ChessBoard: React.FC<ChessBoardProps> = ({
  history,
  onSquareClickMove = noop,
  inCheckSquare,
  ...boardProps
}) => {
  const lastMove = history[history.length - 1];
  const lastMoveStyle = lastMove ? {
    [lastMove.from]: { backgroundColor: 'rgba(255, 255, 0, .4)' },
    [lastMove.to]: { backgroundColor: 'rgba(255, 255, 0, .4)' },
  } : {};

  const inCheckStyle = {
    ...inCheckSquare && {
      [inCheckSquare]: {
        backgroundColor: 'rgba(255, 0, 0, .4)',
      },
    },
  };

  const [clickedSquare, setClickedSquare] = useState<Square | undefined>();
  const [
    clickedSquareStyle,
    setClickedSquareStyle,
  ] = useState({} as Partial<{[sq in Square]: CSSProperties}>);

  useEffect(() => {
    setClickedSquareStyle(
      clickedSquare
        ? {
          [clickedSquare]: {
            backgroundColor: 'rgba(255, 255, 0, .4)',
          },
        }
        : {},
    );
  }, [clickedSquare]);

  useEffect(() => {
    console.log('fen board', boardProps.position);
  }, [boardProps.position]);

  return (
    <Chessboard
      {...boardProps}
      onSquareClick={(square) => {
        setClickedSquare((prev) => {
          if (prev) {
            onSquareClickMove({
              sourceSquare: prev,
              targetSquare: square,
            });

            return undefined;
          }

          return square;
        });
      }}
      squareStyles={{
        ...lastMoveStyle,
        ...clickedSquareStyle,
        ...inCheckStyle,
      }}
    />
  );
};
