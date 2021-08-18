import React, { useCallback, useEffect, useState } from 'react';
import useEventListener from '@use-it/event-listener';
import { ChessHistory, ChessHistoryMove } from 'dstnd-io';
import { keyInObject } from 'src/lib/util';
import { ChessGameHistoryContext, ChessGameHistoryContextProps } from './ChessGameHistoryContext';
import {
  ChessHistoryIndex,
  decrementChessHistoryIndex,
  getChessHistoryAtIndex,
  incrementChessHistoryIndex,
  normalizeChessHistoryIndex,
  getBranchedHistoryLastIndex,
  addMoveToChessHistoryAtNextAvailableIndex,
} from 'src/modules/Room/RoomActivity/activities/AnalysisActivity/lib';

type Props = {
  history: ChessHistory;
  resetOnUpdate?: boolean;
};

export const ChessGameHistoryProvider: React.FC<Props> = ({
  history,
  resetOnUpdate = true,
  ...props
}) => {
  const onReset = useCallback(() => {
    setContextState((prev) => ({
      ...prev,
      history,
      displayedHistory: history,
      displayedIndex: history.length - 1,
    }));
  }, [history]);

  const onRefocus = useCallback(
    (nextIndex: ChessHistoryIndex) => {
      setContextState((prev) => ({
        ...prev,
        displayedIndex: nextIndex,
        displayedHistory: getChessHistoryAtIndex(prev.history, nextIndex),
      }));
    },
    [history]
  );

  const onAddMove = useCallback(
    (move: ChessHistoryMove, atIndex: ChessHistoryIndex, withRefocus = true) => {
      setContextState((prev) => {
        const [nextHistory, addedAtIndex] = addMoveToChessHistoryAtNextAvailableIndex(
          prev.history,
          atIndex,
          move
        );

        return {
          ...prev,
          history: nextHistory,

          ...(withRefocus && {
            displayedIndex: addedAtIndex,
            displayedHistory: getChessHistoryAtIndex(nextHistory, addedAtIndex),
          }),
        };
      });
    },
    [history]
  );

  const [contextState, setContextState] = useState<ChessGameHistoryContextProps>({
    history,
    displayedIndex: history.length - 1,
    displayedHistory: history,
    onReset,
    onRefocus,
    onAddMove,
  });

  useEffect(() => {
    if (resetOnUpdate) {
      onReset();
    }
  }, [history, resetOnUpdate]);

  useEventListener('keydown', (event: object) => {
    if (!keyInObject(event, 'key')) {
      return;
    }

    const normalizedDisplayedIndex = normalizeChessHistoryIndex(contextState.displayedIndex);

    const lastInCurrentBranch = getBranchedHistoryLastIndex(
      contextState.history,
      contextState.displayedIndex
    );
    const normalizedLastInCurrentBranch = normalizeChessHistoryIndex(lastInCurrentBranch);

    if (event.key === 'ArrowRight' && normalizedDisplayedIndex < normalizedLastInCurrentBranch) {
      onRefocus(incrementChessHistoryIndex(contextState.displayedIndex));
    } else if (event.key === 'ArrowLeft' && normalizedDisplayedIndex >= 0) {
      onRefocus(decrementChessHistoryIndex(contextState.displayedIndex));
    }
  });

  return (
    <ChessGameHistoryContext.Provider value={contextState}>
      {props.children}
    </ChessGameHistoryContext.Provider>
  );
};
