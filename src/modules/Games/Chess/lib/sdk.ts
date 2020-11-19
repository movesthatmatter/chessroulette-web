import ChessJS, { ChessInstance } from 'chess.js';
import { ChessGameStatePgn } from 'dstnd-io';

export const getNewChessGame = (pgn?: ChessGameStatePgn) => {
  const instance = new (ChessJS as any)() as ChessInstance;

  if (pgn) {
    instance.load_pgn(pgn);
  }

  return instance;
};

export type { ChessInstance } from 'chess.js';
