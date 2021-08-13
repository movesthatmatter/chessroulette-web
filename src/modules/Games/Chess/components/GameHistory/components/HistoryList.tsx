import React, { useEffect, useState } from 'react';
import { ChessAnalyisHistory } from 'src/modules/Room/RoomActivity/activities/AnalysisActivity/lib';
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
  history: ChessAnalyisHistory;
  onRefocus: (nextIndex: number) => void;
  focusedIndex?: number;
  className?: string;
  rootIndex?: number;
};

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  focusedIndex,
  onRefocus,
  className,
  rootIndex = 0,
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

      if (focusedIndex) {
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
        <>
          <HistoryRow
            key={`${pairedMove[0]?.san}-${pairedMove[1]?.san || ''}`}
            pairedMove={pairedMove}
            index={rootIndex + index}
            isActive={
              focus[0] === index && focus[1] === 0
                ? 'white'
                : focus[0] === index && focus[1] === 1
                ? 'black'
                : undefined
            }
            onClick={() => {
              const nextIndex = reversedLinearIndex(
                pairedHistoryToHistory(pairedHistory),
                pairedToLinearIndex([index, 1])
              );
              onRefocus(nextIndex);
            }}
          />
        </>
      ))}
    </div>
  );
};
