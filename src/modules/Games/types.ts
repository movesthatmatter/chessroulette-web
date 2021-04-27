import { CapturedPiecesRecord, ChessGameState, GameRecord, GameRecordFromGameState } from 'dstnd-io';

export type Game = GameRecord & {
  captured: CapturedPiecesRecord;
};

export type GameFromGameState<TGameState extends ChessGameState> = GameRecordFromGameState<TGameState> & {
  captured: CapturedPiecesRecord;
};
