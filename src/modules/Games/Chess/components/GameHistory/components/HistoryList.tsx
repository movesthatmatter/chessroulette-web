import React, { useEffect, useState } from 'react';
import {
  ChessAnalysisHistory,
  ChessHistoryIndex,
} from 'src/modules/Room/RoomActivity/activities/AnalysisActivity/lib';
import {
  isPartialBlackMove,
  PairedHistory,
  pairedToLinearIndex,
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

  useEffect(() => {
    setPairedHistory(toPairedHistory(history));
  }, [history]);

  return (
    <div className={className}>
      {pairedHistory.map((pairedMove, index) => (
        <HistoryRow
          key={`${pairedMove[0].san}-${pairedMove[1]?.san || ''}`}
          pairedMove={pairedMove}
          pairedIndex={rootPairedIndex + index}
          startingLinearIndex={
            isPartialBlackMove(pairedHistory[0])
              ? // If the history starts with a black move the index needs to be altered
                //  but have no idea how come it needs to be substracted not added
                pairedToLinearIndex([index, 0]) - 1
              : pairedToLinearIndex([index, 0])
          }
          focusedIndex={focusedIndex}
          onFocus={onRefocus}
        />
      ))}
    </div>
  );
};
