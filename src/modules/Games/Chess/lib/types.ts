import { ChessHistoryMove } from 'dstnd-io';

export type HalfMove = [ChessHistoryMove];
export type FullMove = [ChessHistoryMove, ChessHistoryMove];
export type PairedMove = HalfMove | FullMove;
export type PairedHistory = PairedMove[];
