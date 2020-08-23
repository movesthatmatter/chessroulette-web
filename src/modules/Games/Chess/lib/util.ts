import {
  Move, ChessInstance, ShortMove, Piece, Square,
} from 'chess.js';
import { Result, Ok, Err } from 'ts-results';
import { getNewChessGame } from './sdk';

export const getStartingPgn = () => getNewChessGame().pgn();
export const getStartingFen = () => getNewChessGame().fen();

export const getGameFromPgn = (
  pgn: string,
): Result<ChessInstance, void> => {
  const engine = getNewChessGame();

  if (engine.load_pgn(pgn)) {
    return new Ok(engine);
  }

  return new Err(undefined);
};

export const getGameAfterMove = (
  move: ShortMove,
  fromPgn?: string,
): Result<ChessInstance, void> => {
  const engine = fromPgn
    ? getGameFromPgn(fromPgn)
    : new Ok(getNewChessGame());

  if (engine.unwrap()?.move(move)) {
    return engine;
  }

  return new Err(undefined);
};

export const getSquareForPiece = (pgn: string, lookupPiece: Piece) => {
  const engine = getNewChessGame();

  const validPgn = engine.load_pgn(pgn);

  if (!validPgn) {
    return undefined;
  }

  return engine.SQUARES.find((sq) => {
    const p = engine.get(sq);

    return p?.color === lookupPiece.color && p?.type === lookupPiece.type;
  });
};
