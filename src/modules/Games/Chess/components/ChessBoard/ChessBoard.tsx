import Chessboard, { Piece } from 'chessboardjsx';
import React from 'react';
import { Move, Square } from 'chess.js';
import { CSSProperties } from 'src/lib/jss/types';
import { noop } from 'src/lib/util';
import { pieces } from './assets/chessPiecesChessrouletteTheme';


const getPieceRender = (pieceName: keyof typeof pieces, imageSrc: string) => (obj: {
  isDragging: boolean,
  squareWidth: number,
  droppedPiece: Piece,
  targetSquare: Square,
  sourceSquare: Square
}) => (
  <img
    style={{
      width: obj.squareWidth * 0.8,
      height: obj.squareWidth * 0.8,
      marginTop: obj.squareWidth * 0.1,
    }}
    src={imageSrc}
    alt={pieceName}
  />
);

const toShortHandPiece = (p: keyof typeof pieces): Piece => {
  const shortColor = p[0].toLowerCase();

  const piece = p.slice(5);
  let shortPiece;

  if (piece === 'Knight') {
    shortPiece = 'N';
  } else {
    shortPiece = piece[0];
  }

  return `${shortColor}${shortPiece}` as Piece;
}

const piecesToBoardMap = Object.keys(pieces).reduce((prev, nextPieceName) => {
  return {
    ...prev,
    [toShortHandPiece(nextPieceName as keyof typeof pieces)]: getPieceRender(
      nextPieceName as keyof typeof pieces, 
      pieces[nextPieceName as keyof typeof pieces],
    ),
  }
}, {} as ChessBoardProps['pieces']);


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
      pieces={piecesToBoardMap}
    />
  );
};
