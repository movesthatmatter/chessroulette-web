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
  normalizeChessHistoryIndex,
  getBranchedHistoryLastIndex,
  isBranchedHistoryIndex,
  incrementChessHistoryBranchIndex,
  getMoveAtIndex,
  getNextAvailableParallelIndex,
  getAlternativeFollowingMoves,
  getAllFollowingMoves,
} from 'src/modules/Room/RoomActivity/activities/AnalysisActivity/lib';
import { console } from 'window-or-global';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';

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
      // console.log('[Analysis] nextIndex', nextIndex);
      // console.log('[Analysis] nextHistsory', nextHistory);

      setContextState((prev) => {
        // const incremented
        console.group('[Analysis] add move', move.san);
        console.log('current AtIndex:', atIndex);

        const [nextHistory, addedAtIndex] = (() => {
          if (!isBranchedHistoryIndex(atIndex)) {
            console.log('index is a primitive so going normal');
            // If the atIndex isn't a nested branch index just append or create a new branch
            return addMoveToChessHistory(prev.history, move, atIndex);
          }

          const lastIndexInBranch = getBranchedHistoryLastIndex(prev.history, atIndex);
          // If the Branched History atIndex is at the last one or not given, just append
          if (
            !(normalizeChessHistoryIndex(atIndex) < normalizeChessHistoryIndex(lastIndexInBranch))
          ) {
            console.log('index is NOT in the middle of a branched history');
            return addMoveToChessHistory(prev.history, move, atIndex);
          }

          const followingMoves = getAllFollowingMoves(prev.history, atIndex);
          console.log('following moves', followingMoves);

          const followingFoundMoveAndIndex = followingMoves.find(([m]) => m.san === move.san);

          if (followingFoundMoveAndIndex) {
            const [followingFoundMove, followingFoundIndex] = followingFoundMoveAndIndex;
            console.log(
              'index is IN the middle of a branched history and the moves are the same',
              move.san,
              followingFoundMove.san,
              followingFoundIndex
            );
            return [prev.history, followingFoundIndex] as const;
          }
          // If the following move is the same as the given move don't do anything, just refocus on it
          // if (followingMove && move.san === followingMove.san) {

          // }

          // Otherwise add a parallel move
          const nextAvailableBranchIndex = getNextAvailableParallelIndex(prev.history, atIndex);
          console.log('add a parallel move');
          console.log('nextAvailableBranchIndex', nextAvailableBranchIndex);
          return addMoveToChessHistory(prev.history, move, nextAvailableBranchIndex);
        })();

        // if (isBranchedHistoryIndex(atIndex))

        // console.log('adding at index:', addingAtIndex);
        // console.group('isBranchedHistoryIndex', isBranchedHistoryIndex(atIndex));
        // console.log(
        //   'isLowerThan last',
        //   normalizeChessHistoryIndex(lastIndexInBranch),
        //   normalizeChessHistoryIndex(atIndex),
        //   normalizeChessHistoryIndex(lastIndexInBranch) < normalizeChessHistoryIndex(atIndex)
        // );
        // console.groupEnd();
        console.log('added at index:', addedAtIndex);

        console.groupEnd();

        return {
          ...prev,
          history: nextHistory,

          ...(withRefocus && {
            displayedIndex: addedAtIndex,
            displayedHistory: getChessHistoryAtIndex(nextHistory, addedAtIndex),
          }),
        };

        // If it's not the last one then add a parallel branch
        // TODO: But only add it if the next move isn't the same as the next move in branch
        // if (
        //   isBranchedHistoryIndex(atIndex) &&
        //   normalizeChessHistoryIndex(lastIndexInBranch) < normalizeChessHistoryIndex(atIndex)
        // ) {
        //   // const [moveIndex, branchIndex, nestedBranchIndex] = atIndex;

        //   const [nextHistory, addedAtIndex] = addMoveToChessHistory(
        //     prev.history,
        //     move,
        //     incrementChessHistoryBranchIndex(atIndex)
        //   );

        //   console.log('addedAtIndex', addedAtIndex);
        //   // const nextDisplayedIndex = incrementChessHistoryIndex(addedAtIndex);
        //   return {
        //     ...prev,
        //     history: nextHistory,

        //     ...(withRefocus && {
        //       displayedIndex: addedAtIndex,
        //       displayedHistory: getChessHistoryAtIndex(nextHistory, addedAtIndex),
        //     }),
        //   };
        // }

        // const [nextHistory, addedAtIndex] = addMoveToChessHistory(prev.history, move, atIndex);

        // console.log('addedAtIndex', addedAtIndex);
        // const nextDisplayedIndex = incrementChessHistoryIndex(addedAtIndex);
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
    console.group('[HistoryProvider] context updated');
    console.log('new history as pgn', chessHistoryToSimplePgn(contextState.history));
    console.log('new displayed index', contextState.displayedIndex);
    console.log(
      'new displayed history as pgn',
      chessHistoryToSimplePgn(contextState.displayedHistory)
    );
    console.groupEnd();
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

    const normalizedDisplayedIndex = normalizeChessHistoryIndex(contextState.displayedIndex);

    // const historyLength = getHistoryBranch(contextState.history, contextState.displayedIndex).length - 1;
    // const normalizedBranchedHistoryLength = normalizeChessHistoryIndex(historyLength);

    const lastInCurrentBranch = getBranchedHistoryLastIndex(
      contextState.history,
      contextState.displayedIndex
    );
    const normalizedLastInCurrentBranch = normalizeChessHistoryIndex(lastInCurrentBranch);

    // console.group(
    //   '[Provider] on key',
    // );
    // console.log('displayIndex', contextState.displayedIndex, normalizedDisplayedIndex);
    // console.log('history length', historyLength, normalizedBranchedHistoryLength);
    // console.log('lastInCurrentBranch', lastInCurrentBranch, normalizedLastInCurrentBranch);
    // console.groupEnd();

    if (event.key === 'ArrowRight' && normalizedDisplayedIndex < normalizedLastInCurrentBranch) {
      onRefocus(incrementChessHistoryIndex(contextState.displayedIndex));
    } else if (event.key === 'ArrowLeft' && normalizedDisplayedIndex > 0) {
      onRefocus(decrementChessHistoryIndex(contextState.displayedIndex));
    }
  });

  return (
    <ChessGameHistoryContext.Provider value={contextState}>
      {props.children}
    </ChessGameHistoryContext.Provider>
  );
};
