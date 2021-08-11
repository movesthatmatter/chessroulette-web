import { ChessHistory } from 'dstnd-io';
import { createContext } from 'react';

export type ChessGameHistoryContextProps = {
  history: ChessHistory;
  displayedIndex: number;
  displayedHistory: ChessHistory;
  onReset: () => void;
  onRefocus: (nextIndex: number) => void;
};

export const ChessGameHistoryContext = createContext<ChessGameHistoryContextProps>({
  history: [],
  displayedIndex: 0,
  displayedHistory: [],
  onReset: () => {},
  onRefocus: (nextIndex: number) => {},
});
