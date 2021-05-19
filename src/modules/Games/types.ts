import {
  ActivePiecesRecord,
  ChessGameState,
  GameRecord,
  GameRecordFromGameState,
} from 'dstnd-io';

export type Game = GameRecord & {
  activePieces: ActivePiecesRecord;
};

export type GameFromGameState<
  TGameState extends ChessGameState
> = GameRecordFromGameState<TGameState> & {
  activePieces: ActivePiecesRecord;
};
