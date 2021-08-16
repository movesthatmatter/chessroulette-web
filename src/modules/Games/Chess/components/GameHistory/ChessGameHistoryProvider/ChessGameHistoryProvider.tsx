import React, { useCallback, useEffect, useState } from 'react';
import useEventListener from '@use-it/event-listener';
import { ChessHistory, ChessHistoryMove } from 'dstnd-io';
import { keyInObject } from 'src/lib/util';
import { ChessGameHistoryContext, ChessGameHistoryContextProps } from './ChessGameHistoryContext';
import {
  addMoveToChessHistory,
  ChessHistoryIndex,
  decrementChessHistoryIndex,
  getChessHistoryAtIndex,
  incrementChessHistoryIndex,
  isChessHistoryIndexHigherThan,
  isChessHistoryIndexLowerThan,
  getChessHistoryMoveIndex,
  getHistoryBranch,
} from 'src/modules/Room/RoomActivity/activities/AnalysisActivity/lib';
import { console } from 'window-or-global';

type Props = {
  history: ChessHistory;
  resetOnUpdate?: boolean;
};

export const ChessGameHistoryProvider: React.FC<Props> = ({
  history,
  resetOnUpdate = true,
  ...props
}) => {
  // const [history, setHistory] = useState(initHistory);

  // useEffect(() => {
  //   setHistory(history);
  // }, [initHistory]);

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
      console.log(
        '[Analysis] going to add a move',
        move.san,
        'atIndex:',
        atIndex,
        'prevHistory',
        contextState.history.length,
        contextState.history
      );

      // console.log('[Analysis] nextIndex', nextIndex);
      // console.log('[Analysis] nextHistsory', nextHistory);

      setContextState((prev) => {
        const [nextHistory, addedAtIndex] = addMoveToChessHistory(prev.history, move, atIndex);
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
    console.log('[HistoryProvider] context state', contextState);
  }, [contextState]);

  useEffect(() => {
    if (resetOnUpdate) {
      onReset();
    }
  }, [history, resetOnUpdate]);

  useEventListener('keydown', (event: object) => {
    if (!keyInObject(event, 'key')) {
      return;
    }

    if (
      event.key === 'ArrowRight' &&
      isChessHistoryIndexLowerThan(
        contextState.displayedIndex,
        getHistoryBranch(contextState.history, contextState.displayedIndex).length - 1
      )
    ) {
      // onRefocus(contextState.displayedIndex + 1);
      onRefocus(incrementChessHistoryIndex(contextState.displayedIndex));
    } else if (
      event.key === 'ArrowLeft' &&
      isChessHistoryIndexHigherThan(getChessHistoryMoveIndex(contextState.displayedIndex), 0)
    ) {
      onRefocus(decrementChessHistoryIndex(contextState.displayedIndex));
    }
  });

  return (
    <ChessGameHistoryContext.Provider value={contextState}>
      {props.children}
    </ChessGameHistoryContext.Provider>
  );
};
