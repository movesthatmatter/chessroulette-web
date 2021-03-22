import { CapturedPiecesRecord, GameRecord } from 'dstnd-io';

export type Game = GameRecord & {
  captured: CapturedPiecesRecord;
}
