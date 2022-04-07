import { ChessGameColor, ChessMove } from 'chessroulette-io';

export const promotionalSquareToPercentage = (move: ChessMove, orientation: ChessGameColor) => {
  const files = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
  };
  const file = files[move.to[0] as keyof typeof files];

  const multiplier = orientation === 'white' ? file - 1 : 8 - file;

  return multiplier * 12.5;
};
