import { ChessRecursiveBlackMove, ChessRecursiveMove, ChessRecursiveWhiteMove } from 'dstnd-io';

// export type EmptyMove = undefined;
export type PartialWhiteMove = [ChessRecursiveWhiteMove];
export type PartialBlackMove = [ChessRecursiveBlackMove];

export type PartialMove = [ChessRecursiveMove];
export type FullMove = [ChessRecursiveWhiteMove, ChessRecursiveBlackMove];

export type PairedMove = PartialMove | FullMove;
export type PairedHistory = PairedMove[];
