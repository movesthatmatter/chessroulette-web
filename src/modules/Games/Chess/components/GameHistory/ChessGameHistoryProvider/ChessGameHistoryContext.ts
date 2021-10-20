import { FEN } from 'chessground/types';
import {
  ChessGameStateFen,
  ChessHistory,
  ChessHistoryIndex,
  ChessHistoryMove,
  SimplePGN,
} from 'dstnd-io';
import { createContext } from 'react';
import { noop } from 'src/lib/util';

export type ChessGameHistoryContextProps = {
  history: ChessHistory;
  // This is used only for checking if the states should upadte!
  cachedHistoryFen: FEN;

  displayed: {
    index: ChessHistoryIndex;
    history: ChessHistory;
    pgn: SimplePGN;
    // The displayedFen acts as a chcecksum of the displayedHistory & displayedIndex
    //  so we don't have to compare both anymore!
    fen: ChessGameStateFen;
  };

  onReset: () => void;
  onRefocus: (nextIndex: ChessHistoryIndex) => void;
  onAddMove: (p: {
    move: ChessHistoryMove;
    atIndex?: ChessHistoryIndex;
    withRefocus?: boolean;
  }) => void;
};

export const ChessGameHistoryContext = createContext<ChessGameHistoryContextProps>({
  history: [],
  cachedHistoryFen: '',
  displayed: {
    index: 0,
    history: [],
    pgn: '' as SimplePGN,
    fen: '',
  },
  onReset: noop,
  onRefocus: noop,
  onAddMove: noop,
});
