import { ChessGameColor, ChessGameStateFen, ChessGameStatePgn, ChessMove } from 'dstnd-io';
import { ChessgroundProps } from 'react-chessground';

export type ChessBoardType = 'free' | 'play' | 'analysis';

export type ChessBoardConfig = {
  showDests?: boolean;
};

export type ChessBoardGameState = {
  fen: ChessGameStateFen;
  pgn: ChessGameStatePgn;
  turn: ChessGameColor;
  inCheck: boolean;
  lastMove: ChessMove | undefined;
  lastMoveFromTo: [ChessMove['from'], ChessMove['to']] | undefined;
  isPreMovable: boolean;
  movable: ChessgroundProps['movable'];
};