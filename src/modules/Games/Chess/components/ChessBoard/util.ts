import { Key } from 'chessground/types';
import { ChessInstance, Piece, Square } from 'chess.js';
import { ChessGameStateFen, ChessMove } from 'dstnd-io';
import { keyInObject } from 'src/lib/util';

export function toDests(chess: ChessInstance): Map<Key, Key[]> {
  const dests = new Map();
  chess.SQUARES.forEach((s) => {
    const ms = chess.moves({ square: s, verbose: true });
    if (ms.length)
      dests.set(
        s,
        ms.map((m) => m.to)
      );
  });
  return dests;
}

export const isInitialFen = (fen: ChessGameStateFen) => {
  return fen === '' || fen === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
};

// export function playOtherSide(chess: ChessInstance) {
//   return (orig, dest) => {
//     chess.move({ from: orig, to: dest });
//     cg.set({
//       turnColor: toColor(chess),
//       movable: {
//         color: toColor(chess),
//         dests: toDests(chess),
//       },
//     });
//   };
// }

export const isPromotableMove = (piece: Piece, { to: toSquare }: ChessMove) => {
  if (piece.type !== 'p') {
    return false;
  }

  return (
    (piece.color === 'b' &&
      keyInObject(
        {
          a1: true,
          b1: true,
          c1: true,
          d1: true,
          e1: true,
          f1: true,
          g1: true,
          h1: true,
        },
        toSquare
      )) ||
    (piece.color === 'w' &&
      keyInObject(
        {
          a8: true,
          b8: true,
          c8: true,
          d8: true,
          e8: true,
          f8: true,
          g8: true,
          h8: true,
        },
        toSquare
      ))
  );
};
