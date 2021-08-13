import { ChessAnalysisMove } from 'src/modules/Room/RoomActivity/activities/AnalysisActivity/lib';

export type HalfMove = [ChessAnalysisMove];
export type FullMove = [ChessAnalysisMove, ChessAnalysisMove];
export type FullOnlyBlackMove = [undefined, ChessAnalysisMove];
export type PairedMove = HalfMove | FullMove | FullOnlyBlackMove;
export type PairedHistory = PairedMove[];

