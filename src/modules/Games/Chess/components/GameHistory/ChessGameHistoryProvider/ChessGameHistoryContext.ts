import { ChessHistory, ChessHistoryIndex, ChessHistoryMove } from 'dstnd-io';
import { createContext } from 'react';

export type ChessGameHistoryContextProps = {
  history: ChessHistory;
  displayedIndex: ChessHistoryIndex;
  displayedHistory: ChessHistory;
  onReset: () => void;
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
