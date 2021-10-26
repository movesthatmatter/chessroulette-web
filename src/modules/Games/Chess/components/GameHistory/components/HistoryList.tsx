import { debounce } from 'debounce';
import { ChessHistoryIndex, ChessRecursiveHistory } from 'dstnd-io';
import { getChessHistoryMoveIndex } from 'dstnd-io/dist/analysis/analysisActions';
import React, { useEffect, useRef, useState } from 'react';
import useDebouncedEffect from 'use-debounced-effect';
import {
  isPartialBlackMove,
  PairedHistory,
  pairedToLinearIndex,
  toPairedHistory,
} from '../../../lib';
import { HistoryRow } from './HistoryRow';

export type HistoryListProps = {
  history: ChessRecursiveHistory;
  onRefocus: (nextIndex: ChessHistoryIndex) => void;
  focusedIndex?: ChessHistoryIndex;
  rootPairedIndex?: number;
  className?: string;
  rowClassName?: string;
  isNested?: boolean;
};

const scrollIntoView = debounce((elm: HTMLDivElement) => {
  elm.scrollIntoView({ block: 'end', behavior: 'smooth' });
}, 5);

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  focusedIndex,
  onRefocus,
  className,
  rootPairedIndex = 0,
  rowClassName,
  isNested = false,
}) => {
  const rowElementRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const containerElementRef = useRef<HTMLDivElement | null>();
  const [pairedHistory, setPairedHistory] = useState<PairedHistory>(toPairedHistory(history));

  useEffect(() => {
    setPairedHistory(toPairedHistory(history));
  }, [history]);

  useDebouncedEffect(() => {
    if (isNested) {
      return;
    }

    if (pairedHistory.length === 0) {
      return;
    }

    const moveIndex = Math.floor(getChessHistoryMoveIndex(focusedIndex) / 2);
    const elm = rowElementRefs.current[moveIndex];

    if (elm) {
      scrollIntoView(elm);
    }
  }, 100, [pairedHistory, focusedIndex, isNested]);

  useEffect(() => {
    if (containerElementRef.current) {
      containerElementRef.current.scrollTo(0, 9999);
    }
  }, []);

  return (
    <div className={className} ref={(e) => (containerElementRef.current = e)}>
      {pairedHistory.map((pairedMove, index) => (
        <HistoryRow
          key={`${pairedMove[0].san}-${pairedMove[1]?.san || ''}`}
          ref={(b) => (rowElementRefs.current[index] = b)}
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
          containerClassName={rowClassName}
          isNested={isNested}
        />
      ))}
    </div>
  );
};
