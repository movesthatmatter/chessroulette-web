import { ChessMove } from 'dstnd-io';

export type EngineCPScore = {
  unit: 'cp';
  value: number;
  time: number;
};

export type EngineMateScore = {
  unit: 'mate';
  value: number;
};

export type EngineScore = EngineCPScore | EngineMateScore;

export type EngineDepthLine = {
  type: 'depthLine';
  depth: number;
  score: EngineScore;
  pv: string;
};

export type EngineDepthLineWithMateScore = Omit<EngineDepthLine, 'score'> & {
  score: EngineMateScore;
};

export type EngineOtherLine = {
  type: 'other';
  string: string;
};

export type EngineLine = EngineDepthLine | EngineOtherLine;

export type EngineAnalysisRecord = {
  bestMove?: ChessMove;
  ponderMove?: ChessMove;
  info: EngineLine[];
};
