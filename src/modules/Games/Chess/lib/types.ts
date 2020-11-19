import { Move } from 'chess.js';

export type History = Move[];
export type HalfMove = [Move];
export type FullMove = [Move, Move];
export type PairedMove = HalfMove | FullMove;
export type PairedHistory = PairedMove[];