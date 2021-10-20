import { Move } from 'chess.js';
import { ChessGameColor, ChessGameStateFen, ChessGameStatePgn, ChessMove } from 'dstnd-io';
import { ChessgroundProps } from 'react-chessground';

export type ChessBoardType = 'free' | 'play' | 'analysis';

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

  // The Fen is only used for displayable purposes
  //  while the fen & pgn is used to calculate the game actions (move, premove, etc...)
  displayable: {
    fen: ChessGameStateFen;
    lastMoveFromTo: [ChessMove['from'], ChessMove['to']] | undefined;
  }
};