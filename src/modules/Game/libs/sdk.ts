import ChessJS, { ChessInstance } from 'chess.js';

export const getNewChessGame = (pgn?: string) => new (ChessJS as any)(pgn) as ChessInstance;