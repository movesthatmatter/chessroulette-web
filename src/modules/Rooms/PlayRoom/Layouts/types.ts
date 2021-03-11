import { Move } from 'chess.js';
import { ChessGameColor, ChessGameStatePgn, ChessMove, ChessPlayer, GameRecord } from 'dstnd-io';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';

export type ChessGameHistory = Move[];

export type LayoutProps = {
  room: RoomWithPlayActivity;
  game: GameRecord;
  historyIndex: number;
  onHistoryIndexUpdated: (i: number) => void;

  onMove: (
    m: ChessMove,
    pgn: ChessGameStatePgn,
    history: ChessGameHistory,
    color: ChessGameColor
  ) => void;
  onResign: () => void;
  onAbort: () => void;
  onOfferDraw: () => void;
  onRematchOffer: () => void;

  // TODO: Remove in favor of using a custom hook that takes in account the game at a higher level
  onTimerFinished: () => void;

  // TODO Stats - to be replaced
  homeColor: ChessGameColor;
  meAsPlayer?: ChessPlayer;
  opponentAsPlayer?: ChessPlayer;
  canIPlay: boolean;
};
