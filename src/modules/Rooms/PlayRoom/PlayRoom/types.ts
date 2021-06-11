// import { Move } from 'chess.js';
import { ChessGameColor, ChessPlayer } from 'dstnd-io';
import { Game } from 'src/modules/Games';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';

export type PlayProps = {
  // TODO: None of these are related to Layouts
  room: RoomWithPlayActivity;
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
