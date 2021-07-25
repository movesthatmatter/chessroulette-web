// import { Move } from 'chess.js';
import { ChessGameColor, ChessPlayer } from 'dstnd-io';
import { Game } from 'src/modules/Games';

export type PlayProps = {
  game: Game;
  historyIndex: number;
  onHistoryIndexUpdated: (i: number) => void;
  displayedPgn?: Game['pgn'];

  // TODO Stats - to be replaced
  homeColor: ChessGameColor;
  meAsPlayer?: ChessPlayer;
  opponentAsPlayer?: ChessPlayer;
  playable: boolean;
};
