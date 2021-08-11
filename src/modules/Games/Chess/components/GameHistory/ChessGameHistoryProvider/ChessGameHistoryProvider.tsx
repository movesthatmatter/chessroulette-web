import React, { useCallback, useEffect, useState } from 'react';
import useEventListener from '@use-it/event-listener';
import { ChessHistory } from 'dstnd-io';
import { keyInObject } from 'src/lib/util';
import { ChessGameHistoryContext, ChessGameHistoryContextProps } from './ChessGameHistoryContext';

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
      displayedIndex: 0,
    }));
  }, [history]);

  const onRefocus = useCallback(
    (nextIndex: number) => {
      setContextState((prev) => ({
        ...prev,
        displayedIndex: nextIndex,
        displayedHistory: history.slice(0, history.length - nextIndex),
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

    if (event.key === 'ArrowRight' && contextState.displayedIndex > 0) {
      onRefocus(contextState.displayedIndex - 1);
    } else if (event.key === 'ArrowLeft' && contextState.displayedIndex < history.length) {
      onRefocus(contextState.displayedIndex + 1);
    }
  });

  return (
    <ChessGameHistoryContext.Provider value={contextState}>
      {props.children}
    </ChessGameHistoryContext.Provider>
  );
};
