import { Key } from 'chessground/types';
import { ChessInstance } from 'chess.js';
import { ChessGameStateFen } from 'dstnd-io';

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
}

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
