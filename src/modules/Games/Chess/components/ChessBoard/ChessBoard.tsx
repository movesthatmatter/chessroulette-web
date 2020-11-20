import Chessboard, { Piece } from 'chessboardjsx';
import React, { useEffect, useState } from 'react';
import { Move, Square } from 'chess.js';
import { CSSProperties } from 'src/lib/jss/types';
import { pieces } from './assets/chessPiecesChessrouletteTheme';
import {
  getSquareForPiece,
  getTurn,
  historyToFen,
  historyToPgn,
  inCheck,
} from '../../lib';

const getPieceRender = (pieceName: keyof typeof pieces, imageSrc: string) => (obj: {
  isDragging: boolean;
  squareWidth: number;
  droppedPiece: Piece;
  targetSquare: Square;
  sourceSquare: Square;
}) => (
  <img
    style={
      isWhite(pieceName)
        ? {
            width: obj.squareWidth * 0.8,
            height: obj.squareWidth * 0.8,
            marginTop: obj.squareWidth * 0.1,
          }
        : {
            width: obj.squareWidth * 0.72,
            height: obj.squareWidth * 0.72,
            marginTop: obj.squareWidth * 0.16,
          }
    }
    src={imageSrc}
    alt={pieceName}
  />
);

const isWhite = (p: keyof typeof pieces) => p[0] === 'w';

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
};

const piecesToBoardMap = Object.keys(pieces).reduce((prev, nextPieceName) => {
  return {
    ...prev,
    [toShortHandPiece(nextPieceName as keyof typeof pieces)]: getPieceRender(
      nextPieceName as keyof typeof pieces,
      pieces[nextPieceName as keyof typeof pieces]
    ),
  };
}, {} as ChessBoardProps['pieces']);

export type ChessBoardProps = Omit<Chessboard['props'], 'fen'> & {
  history: Move[];
  inCheckSquare?: Square;
  clickedSquareStyle: Partial<{ [sq in Square]: CSSProperties }>;
};

export const ChessBoard: React.FC<ChessBoardProps> = ({
  history,
  clickedSquareStyle,
  ...boardProps
}) => {
  const [inCheckSquare, setInCheckSquare] = useState<Square>();

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

  useEffect(() => {
    if (history.length === 0) {
      return;
    }

    const pgn = historyToPgn(history);

    // Visual Effects
    setInCheckSquare(() => {
      if (inCheck(pgn)) {
        return getSquareForPiece(pgn, { color: getTurn(pgn), type: 'k' });
      }

      return undefined;
    });
  }, [history]);

  return (
    <Chessboard
      key={history.length}
      {...boardProps}
      squareStyles={{
        ...lastMoveStyle,
        ...clickedSquareStyle,
        ...inCheckStyle,
      }}
      pieces={piecesToBoardMap}
      boardStyle={{
        ...boardProps.boardStyle,
        position: 'relative',
      }}
      position={historyToFen(history)}
    />
  );
};
