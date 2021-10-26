import React, { useCallback, useEffect } from 'react';
import useEventListener from '@use-it/event-listener';
import { ChessHistory, ChessHistoryIndex, ChessHistoryMove, analysis } from 'dstnd-io';
import { keyInObject, noop } from 'src/lib/util';
import { ChessGameHistoryContext, ChessGameHistoryContextProps } from './ChessGameHistoryContext';
import { useDebouncedCallback } from 'use-debounce';
import { useStateWithCallback } from 'src/lib/hooks/useStateWithCallback';
import { historyToFen, pgnToFen } from '../../../lib';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';

export type ChessGameHistoryProviderProps = {
  history: ChessHistory;
  onMoved?: (move: ChessHistoryMove, atIndex: ChessHistoryIndex) => void;
  onRefocused?: (atIndex: ChessHistoryIndex) => void;
  onUpdated?: (next: ChessHistory) => void;
  displayedIndex?: ChessHistoryIndex;
  resetOnUpdate?: boolean;
};

export const ChessGameHistoryProvider: React.FC<ChessGameHistoryProviderProps> = ({
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
      displayed: {
        history,
        index: displayedIndex === undefined ? history.length - 1 : displayedIndex,
        fen: historyToFen(history),
        pgn: chessHistoryToSimplePgn(history),
      },
    }));
  }, [history]);

  const onRefocus = useCallback(
    (nextIndex: ChessHistoryIndex) => {
      setContextState((prev) => {
        const nextHistory = analysis.actions.getChessHistoryAtIndex(prev.history, nextIndex);
        const nextPgn = chessHistoryToSimplePgn(nextHistory);

        return {
          ...prev,
          displayed: {
            index: nextIndex,
            history: nextHistory,
            pgn: nextPgn,
            fen: pgnToFen(nextPgn),
          },
        };
      });

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
    // Move here should be a regular ChessMove (the action should transform it into ChessHistoryMove)!
    ({
      move,
      atIndex, // If not given it will be appended at the end of the main history
      withRefocus = true,
    }: {
      move: ChessHistoryMove;
      atIndex?: ChessHistoryIndex;
      withRefocus?: boolean;
    }) => {
      setContextState(
        (prev) => {
          const addAtIndex = atIndex !== undefined ? atIndex : prev.history.length;
          const [
            nextHistory,
            addedAtIndex,
            // This shouldn't be branded as analysis as it's used for the game now as well, but something
            //  more along the lines of ChessHistory which happen to be used by analysis (and game)!
          ] = analysis.actions.addMoveToChessHistoryAtNextAvailableIndex(
            prev.history,
            addAtIndex,
            move
          );
          const nextCachedHistoryFen = historyToFen(nextHistory);
          const nextDisplayedHistory = analysis.actions.getChessHistoryAtIndex(
            nextHistory,
            addedAtIndex
          );
          const nextDisplayedPgn = chessHistoryToSimplePgn(nextDisplayedHistory);

          return {
            ...prev,
            history: nextHistory,
            cachedHistoryFen: nextCachedHistoryFen,
            ...(withRefocus && {
              // All of these could actually come from the addMove library
              //   (and eventually even from the server since all the computations are done anyway)
              displayed: {
                index: addedAtIndex,
                history: nextDisplayedHistory,
                pgn: nextDisplayedPgn,
                fen: pgnToFen(nextDisplayedPgn),
              },
            }),
          };
        },
        (nextState) => {
          onMoved(move, nextState.displayed.index);
        }
      );
    },
    [history]
  );

  const [contextState, setContextState] = useStateWithCallback<ChessGameHistoryContextProps>(
    (() => {
      const historyPgn = chessHistoryToSimplePgn(history);
      const cachedHistoryFen = pgnToFen(historyPgn);

      return {
        history,
        cachedHistoryFen,
        // All of the displayedProps including the cachedFen
        /// could be moved on the Server in the addMove function
        displayed: {
          index: history.length - 1,
          history,
          fen: cachedHistoryFen,
          pgn: historyPgn,
        },

        onReset,
        onRefocus,
        onAddMove,
      };
    })()
  );

  useEffect(() => {
    setContextState((prev) => {
      const nextIndex = displayedIndex === undefined ? history.length - 1 : displayedIndex;
      const nextDisplayedHistory = analysis.actions.getChessHistoryAtIndex(history, nextIndex);

      // Use this to check wether this needs to update or not
      // TODO: These should actually come from the server using the same library as on the
      //   client to guarantee a match ((chessHistory|analysis).addMove as o)
      const nextCachedHistoryFen = historyToFen(history);
      const nextDisplayedPgn = chessHistoryToSimplePgn(nextDisplayedHistory);
      const nextDisplayedFen = pgnToFen(nextDisplayedPgn);

      // Return early if the cachedFen or displayedFen haven't changed
      //   Note: the displayedFen takes in acctount the displyedIndex change!
      if (
        prev.displayed.fen === nextDisplayedFen &&
        prev.cachedHistoryFen === nextCachedHistoryFen
      ) {
        return prev;
      }

      return {
        ...prev,
        history,
        displayed: {
          history: nextDisplayedHistory,
          index: nextIndex,
          pgn: nextDisplayedPgn,
          fen: nextDisplayedFen,
        },
      };
    });
  }, [history, displayedIndex]);

  useEventListener('keydown', (event: object) => {
    if (!keyInObject(event, 'key')) {
      return;
    }

    const normalizedDisplayedIndex = analysis.actions.normalizeChessHistoryIndex(
      contextState.displayed.index
    );

    const lastInCurrentBranch = analysis.actions.getBranchedHistoryLastIndex(
      contextState.history,
      contextState.displayed.index
    );
    const normalizedLastInCurrentBranch = analysis.actions.normalizeChessHistoryIndex(
      lastInCurrentBranch
    );

    if (event.key === 'ArrowRight' && normalizedDisplayedIndex < normalizedLastInCurrentBranch) {
      onRefocus(analysis.actions.incrementChessHistoryIndex(contextState.displayed.index));
    } else if (event.key === 'ArrowLeft' && normalizedDisplayedIndex >= 0) {
      onRefocus(analysis.actions.decrementChessHistoryIndex(contextState.displayed.index));
    }
  });

  return (
    <ChessGameHistoryContext.Provider value={contextState}>
      {props.children}
    </ChessGameHistoryContext.Provider>
  );
};
