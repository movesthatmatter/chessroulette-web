import { Move } from 'chess.js';
import { ChessGameColor, ChessGameStateFen, ChessGameStatePgn, ChessMove } from 'chessroulette-io';
import { ChessgroundProps } from 'react-chessground';

export type ChessBoardType = 'free' | 'play' | 'analysis' | 'relay';

export type ChessBoardConfig = {
  showDests?: boolean;
};

export type ChessBoardGameState = {
  pgn: ChessGameStatePgn;
  fen: ChessGameStateFen;
  history: Move[];

  turn: ChessGameColor;
  inCheck: boolean;
  isPreMovable: boolean;
  movable: ChessgroundProps['movable'];

  displayable: {
    fen: ChessGameStateFen;
    lastMoveFromTo: [ChessMove['from'], ChessMove['to']] | undefined;
  }
};