import React, { useCallback, useEffect, useState } from 'react';
import useEventListener from '@use-it/event-listener';
import { ChessHistory, ChessHistoryIndex, ChessHistoryMove, analysis } from 'dstnd-io';
import { keyInObject, noop } from 'src/lib/util';
import { ChessGameHistoryContext, ChessGameHistoryContextProps } from './ChessGameHistoryContext';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  history: ChessHistory;
  onMoved?: (move: ChessHistoryMove, atIndex: ChessHistoryIndex) => void;
  onRefocused?: (atIndex: ChessHistoryIndex) => void;
  onUpdated?: (next: ChessHistory) => void;
  displayedIndex?: ChessHistoryIndex;
  resetOnUpdate?: boolean;
};

export const ChessGameHistoryProvider: React.FC<Props> = ({
  history,
  resetOnUpdate = true,
  onMoved = noop,
  onRefocused = noop,
  onUpdated = noop,
  displayedIndex,
  ...props
}) => {
  const onReset = useCallback(() => {
    setContextState((prev) => ({
      ...prev,
      history,
      displayedHistory: history,
      displayedIndex: displayedIndex === undefined ? history.length - 1 : displayedIndex,
    }));
  }, [history]);

  const onRefocus = useCallback(
    (nextIndex: ChessHistoryIndex) => {
      setContextState((prev) => ({
        ...prev,
        displayedIndex: nextIndex,
        displayedHistory: analysis.actions.getChessHistoryAtIndex(prev.history, nextIndex),
      }));

      // TODO: This isn't the best here for now, since it doesn't actually check
      // that the refocus actually worked, meaning it got updated and it was not
      debouncedOnRefocused(nextIndex);
    },
    [history]
  );

  // This needs to be debounced because if keys are pressed too rapidaly
  // or in case of a longpress, the server shouldn't be hit that often!
  const debouncedOnRefocused = useDebouncedCallback(onRefocused, 300, {
    leading: true,
    trailing: true,
  });

  const onAddMove = useCallback(
    (move: ChessHistoryMove, atIndex: ChessHistoryIndex, withRefocus = true) => {
      setContextState((prev) => {
        const [
          nextHistory,
          addedAtIndex,
        ] = analysis.actions.addMoveToChessHistoryAtNextAvailableIndex(prev.history, atIndex, move);

        return {
          ...prev,
          history: nextHistory,
          ...(withRefocus && {
            displayedIndex: addedAtIndex,
            displayedHistory: analysis.actions.getChessHistoryAtIndex(nextHistory, addedAtIndex),
          }),
        };
      });

      // TODO: This isn't the best here for now, since it doesn't actually check
      // that the refocus actually worked, meaning it got updated and it was not
      onMoved(move, atIndex);
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
    setContextState((prev) => {
      const nextIndex = displayedIndex === undefined ? history.length - 1 : displayedIndex;
      const nextDisplayedHistory = analysis.actions.getChessHistoryAtIndex(history, nextIndex);

      return {
        ...prev,
        history,
        displayedHistory: nextDisplayedHistory,
        displayedIndex: nextIndex,
      };
    });
  }, [history, displayedIndex]);

  useEventListener('keydown', (event: object) => {
    if (!keyInObject(event, 'key')) {
      return;
    }

    const normalizedDisplayedIndex = analysis.actions.normalizeChessHistoryIndex(
      contextState.displayedIndex
    );

    const lastInCurrentBranch = analysis.actions.getBranchedHistoryLastIndex(
      contextState.history,
      contextState.displayedIndex
    );
    const normalizedLastInCurrentBranch = analysis.actions.normalizeChessHistoryIndex(
      lastInCurrentBranch
    );

    if (event.key === 'ArrowRight' && normalizedDisplayedIndex < normalizedLastInCurrentBranch) {
      onRefocus(analysis.actions.incrementChessHistoryIndex(contextState.displayedIndex));
    } else if (event.key === 'ArrowLeft' && normalizedDisplayedIndex >= 0) {
      onRefocus(analysis.actions.decrementChessHistoryIndex(contextState.displayedIndex));
    }
  });

  return (
    <ChessGameHistoryContext.Provider value={contextState}>
      {props.children}
    </ChessGameHistoryContext.Provider>
  );
};
