import React, { useEffect, useState } from 'react';
import {
  ChessAnalysisHistory,
  ChessHistoryIndex,
} from 'src/modules/Room/RoomActivity/activities/AnalysisActivity/lib';
import {
  linearToPairedIndex,
  PairedHistory,
  pairedHistoryToHistory,
  PairedIndex,
  pairedToLinearIndex,
  reversedLinearIndex,
  toPairedHistory,
} from '../../../lib';
import { HistoryRow } from './HistoryRow';

export type HistoryListProps = {
  history: ChessAnalysisHistory;
  onRefocus: (nextIndex: ChessHistoryIndex) => void;
  focusedIndex?: ChessHistoryIndex;
  className?: string;
  rootPairedIndex?: number;
};

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  focusedIndex,
  onRefocus,
  className,
  rootPairedIndex = 0,
}) => {
  const [pairedHistory, setPairedHistory] = useState<PairedHistory>([]);
  const [focus, setFocus] = useState<PairedIndex>([-1, -1]);

  useEffect(() => {
    if (history) {
      setPairedHistory(
        toPairedHistory([
          // getChessHistoryEmptyMove(),
          ...history,
        ])
      );

      if (typeof focusedIndex === 'number') {
        setFocus(linearToPairedIndex(history, focusedIndex));
      }
      // const currentRowElm = rowElementRefs.current[linearToPairedIndex(history, focusedIndex)[0]];
      // if (currentRowElm) {
      //   scrollIntoView(currentRowElm);
      // }
    } else {
      setPairedHistory([]);
    }
  }, [history, focusedIndex]);
  // const rowElementRefs = useRef<Record<number, HTMLDivElement | null>>({});

  return (
    <div className={className}>
      {pairedHistory.map((pairedMove, index) => (
        <HistoryRow
          key={`${pairedMove[0]?.san}-${pairedMove[1]?.san || ''}`}
          pairedMove={pairedMove}
          pairedIndex={rootPairedIndex + index}
          isActive={
            focus[0] === index && focus[1] === 0
              ? 'white'
              : focus[0] === index && focus[1] === 1
              ? 'black'
              : undefined
          }
          whiteMoveLinearIndex={pairedToLinearIndex([index, 0])}
          focusedIndex={focusedIndex}
          onFocus={onRefocus}
        />
      ))}
    </div>
  );
};
