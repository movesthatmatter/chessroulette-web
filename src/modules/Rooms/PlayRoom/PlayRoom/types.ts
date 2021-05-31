// import { Move } from 'chess.js';
import { ChessGameColor, ChessPlayer } from 'dstnd-io';
import { Game } from 'src/modules/Games';
import { ChessBoardProps } from 'src/modules/Games/Chess/components/ChessBoard';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';

// TODO: Deprecate in favor of io
// export type ChessGameHistory = Move[];

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
  // canIPlay: boolean;

  gameNotificationDialog?: ChessBoardProps['notificationDialog'];
};
