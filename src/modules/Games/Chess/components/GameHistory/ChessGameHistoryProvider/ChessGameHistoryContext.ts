import { ChessHistory, ChessHistoryMove } from 'dstnd-io';
import { createContext } from 'react';
import { ChessHistoryIndex } from 'src/modules/Room/RoomActivity/activities/AnalysisActivity/lib';

export type ChessGameHistoryContextProps = {
  history: ChessHistory;
  displayedIndex: ChessHistoryIndex;
  displayedHistory: ChessHistory;
  onReset: () => void;

  // | moveIndex
  // | [moveIndex branchIndex nestedMoveIndex]
  // | [moveIndex branchIndex [nestedMoveIndex nestedBranchIndex nestedNestedMoveIndex]]
  onRefocus: (nextIndex: ChessHistoryIndex) => void;

  onAddMove: (move: ChessHistoryMove, atIndex: ChessHistoryIndex, withRefocus?: boolean) => void;
};

export const ChessGameHistoryContext = createContext<ChessGameHistoryContextProps>({
  history: [],
  displayedIndex: 0,
  displayedHistory: [],
  onReset: () => {},
  onRefocus: () => {},
  onAddMove: () => {},
});
