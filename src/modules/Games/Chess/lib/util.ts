import { ChessInstance, ShortMove, Piece, Square } from 'chess.js';
import { Result, Ok, Err } from 'ts-results';
import { getNewChessGame } from './sdk';
import { ChessGameState, ChessGameStatePgn, ChessMove, UserRecord } from 'dstnd-io';
import { FullMove, HalfMove, History, PairedMove, PairedHistory } from './types';
import { flatten } from 'src/lib/util';

export const getStartingPgn = () => getNewChessGame().pgn();
export const getStartingFen = () => getNewChessGame().fen();

export const getGameFromPgn = (pgn: string): Result<ChessInstance, void> => {
  const engine = getNewChessGame();

  if (engine.load_pgn(pgn)) {
    return new Ok(engine);
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

export const toChessColor = (c: 'w' | 'white' | 'b' | 'black') => {
  return c === 'b' || c === 'black' ? 'black' : 'white';
};

export const isFullMove = (pm: unknown): pm is FullMove => Array.isArray(pm) && pm.length === 2;
export const isHalfMove = (pm: unknown): pm is HalfMove => Array.isArray(pm) && pm.length === 1;
export const isPairedMove = (pm: unknown): pm is PairedMove => isFullMove(pm) || isHalfMove(pm);

export const toPairedHistory = (moves: History): PairedHistory =>
  moves.reduce((prev, next) => {
    if (prev.length === 0) {
      return [[next]];
    }

    const lastMove = prev.slice(-1)[0];
    if (isFullMove(lastMove)) {
      return [...prev, [next]];
    }

    const nextFullMove: FullMove = [...lastMove, next];
    const prevWithoutLastMove = prev.slice(0, -1);

    return [...prevWithoutLastMove, nextFullMove];
  }, [] as PairedHistory);

export const pairedHistoryToHistory = (ph: PairedHistory): History => flatten(ph) as unknown as History;

// [0] - The PairedMove index
// [1] - The color/side index
export type PairedIndex = [number, number];

export const linearToPairedIndex = (history: History, index: number): PairedIndex => {
  const diff = history.length - 1 - index;
  
  return [Math.floor(diff / 2), diff % 2];
}

export const pairedToLinearIndex = (index: PairedIndex) => index[0] * 2 + index[1];

export const reversedLinearIndex = (history: History, index: number) => history.length - index - 1;

export const historyToPgn = (moves: History): ChessGameStatePgn =>
  toPairedHistory(moves)
    .map((pm, index) =>
      isFullMove(pm) ? `${index + 1}. ${pm[0].san} ${pm[1].san}` : `${index + 1}. ${pm[0].san}`
    )
    .join(' ');

export const pgnToFen = (pgn: ChessGameStatePgn) => getNewChessGame(pgn).fen();

export const pgnToHistory = (pgn: ChessGameStatePgn) =>
  getNewChessGame(pgn).history({ verbose: true });

export const historyToFen = (h: History) => pgnToFen(historyToPgn(h));

export const inCheckMate = (pgn: ChessGameStatePgn) => getNewChessGame(pgn).in_checkmate();
export const inCheck = (pgn: ChessGameStatePgn) => getNewChessGame(pgn).in_check();
export const inDraw = (pgn: ChessGameStatePgn) => getNewChessGame(pgn).in_draw();
export const isGameOver = (pgn: ChessGameStatePgn) => getNewChessGame(pgn).game_over();

export const getTurn = (pgn: ChessGameStatePgn) => getNewChessGame(pgn).turn();
export const getSquare = (pgn: ChessGameStatePgn, square: Square) => getNewChessGame(pgn).get(square);
export const isValidMove = (pgn: ChessGameStatePgn, m: ChessMove) => getNewChessGame(pgn).move(m) !== null;
export const getPgnAfterMove = (pgn: ChessGameStatePgn, m: ChessMove): Result<ChessGameStatePgn, void> => {
  const instance = getNewChessGame(pgn);

  if (instance.move(m)) {
    return new Ok(instance.pgn());
  }

  return Err(undefined);
}


// @Deprecate as it's not used
export const getGameAfterMove = (
  move: ShortMove,
  fromPgn?: string
): Result<ChessInstance, void> => {
  const engine = fromPgn ? getGameFromPgn(fromPgn) : new Ok(getNewChessGame());

  if (engine.unwrap()?.move(move)) {
    return engine;
  }

  return new Err(undefined);
};


export const getPlayerStats = (game: ChessGameState, playerUserId: UserRecord['id']) => {
  
}