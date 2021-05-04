import { Move } from 'chess.js';
import { ChessGameColor, ChessGameStatePgn, ChessHistory, ChessMove, ChessPlayer } from 'dstnd-io';
import { Game } from 'src/modules/Games';
import { ChessBoardProps } from 'src/modules/Games/Chess/components/ChessBoardV2';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';

export type ChessGameHistory = Move[];

export type LayoutProps = {
  room: RoomWithPlayActivity;
  game: Game;
  historyIndex: number;
  onHistoryIndexUpdated: (i: number) => void;
  displayedPgn?: Game['pgn'];

  onMove: (
    m: ChessMove,
    pgn: ChessGameStatePgn,
    history: ChessGameHistory,
    color: ChessGameColor
  ) => void;
  onResign: () => void;
  onOfferDraw: () => void;
  onRematchOffer: () => void;

  // TODO: Remove in favor of using a custom hook that takes in account the game at a higher level
  onTimerFinished: () => void;

  // TODO Stats - to be replaced
  homeColor: ChessGameColor;
  meAsPlayer?: ChessPlayer;
  opponentAsPlayer?: ChessPlayer;
  playable: boolean;
  // canIPlay: boolean;

  gameNotificationDialog?: ChessBoardProps['notificationDialog'];
};
