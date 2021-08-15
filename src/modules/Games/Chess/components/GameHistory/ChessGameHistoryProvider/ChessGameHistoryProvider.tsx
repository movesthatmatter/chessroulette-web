import React, { useCallback, useEffect, useState } from 'react';
import useEventListener from '@use-it/event-listener';
import { ChessHistory } from 'dstnd-io';
import { keyInObject } from 'src/lib/util';
import { ChessGameHistoryContext, ChessGameHistoryContextProps } from './ChessGameHistoryContext';
import {
  ChessHistoryIndex,
  getChessHistoryAtIndex,
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
      displayedHistory: history,
      displayedIndex: history.length - 1,
    }));
  }, [history]);

  const onRefocus = useCallback(
    (nextIndex: ChessHistoryIndex) => {
      setContextState((prev) => ({
        ...prev,
        displayedIndex: nextIndex,
        displayedHistory: getChessHistoryAtIndex(history, nextIndex),
      }));
    },
    [history]
  );

  const [contextState, setContextState] = useState<ChessGameHistoryContextProps>({
    history,
    displayedIndex: history.length - 1,
    displayedHistory: history,
    onReset,
    onRefocus,
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

    if (event.key === 'ArrowRight' && contextState.displayedIndex < history.length - 1) {
      if (typeof contextState.displayedIndex === 'number') {
        onRefocus(contextState.displayedIndex + 1);
      }
    } else if (event.key === 'ArrowLeft' && contextState.displayedIndex > 0) {
      if (typeof contextState.displayedIndex === 'number') {
        onRefocus(contextState.displayedIndex - 1);
      }
    }
  });

  return (
    <ChessGameHistoryContext.Provider value={contextState}>
      {props.children}
    </ChessGameHistoryContext.Provider>
  );
};
