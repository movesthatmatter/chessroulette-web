import { ChessHistory, ChessHistoryMove } from 'dstnd-io';
import { console, indexedDB, Number } from 'window-or-global';

// @deprecate in favor NestedChessHistoryMove
export type ChessAnalysisMove = ChessHistoryMove & {
  branchedHistories?: ChessAnalyisHistory[] | undefined;
};

// @deprecate in favor of NestedChessHistory
export type ChessAnalyisHistory = ChessAnalysisMove[];

export type RecursiveChessHistoryMove = ChessAnalysisMove;
export type RecursiveChessHistory = ChessAnalyisHistory;

export type LinearChessHistory = ChessHistory;

// indexes: [move branch]
// indexes: [move branch [branchMove nestedBranch]]
// indexes: [move branch [branchMove nestedBranch [nestedBranchMove nestedNestedBranch]]]
export type BranchedHistoryIndex = [
  moveIndex: number,
  branchIndex: number,
  nestedBranchedHistoryOrMoveIndex?: BranchedHistoryIndex | number
];

export type ChessHistoryIndex = number | BranchedHistoryIndex;

export const isBranchedHistoryIndex = (a: unknown): a is BranchedHistoryIndex =>
  Array.isArray(a) &&
  (a.length === 2 || a.length === 3) &&
  typeof a[0] === 'number' &&
  typeof a[1] === 'number';

export const getNestedChessHistoryIndex = (i: ChessHistoryIndex): ChessHistoryIndex | undefined =>
  typeof i !== 'number' ? i[2] : undefined;

export const addMoveToChessHistory = (
  history: ChessAnalyisHistory,
  m: ChessHistoryMove,
  chessHistoryIndex?: ChessHistoryIndex
): [nextHistory: ChessAnalyisHistory, nextIndex: ChessHistoryIndex] => {
  if (isBranchedHistoryIndex(chessHistoryIndex)) {
    const [moveIndex, branchIndex, nestedBranchedHistoryOrMoveIndex] = chessHistoryIndex;

    const nestedBranchIndex = isBranchedHistoryIndex(nestedBranchedHistoryOrMoveIndex)
      ? nestedBranchedHistoryOrMoveIndex
      : undefined;

    const currentMove = history[moveIndex];

    if (currentMove.branchedHistories) {
      const [nextNestedHistory, nextNestedHistoryIndex] = addMoveToChessHistory(
        currentMove.branchedHistories[branchIndex],
        m,
        nestedBranchIndex
      );

      const nextBranchedHistories = currentMove.branchedHistories
        ? [
            ...currentMove.branchedHistories.slice(0, branchIndex),
            nextNestedHistory,
            ...currentMove.branchedHistories.slice(branchIndex + 1),
          ]
        : [[m]];

      const nextHistory = [
        ...history.slice(0, moveIndex),
        {
          ...history[moveIndex],
          branchedHistories: nextBranchedHistories,
        },
        ...history.slice(moveIndex + 1),
      ];

      return [nextHistory, [moveIndex, branchIndex, nextNestedHistoryIndex]];
    }

    const nextBranchedHistories = [[m]];

    const nextHistory = [
      ...history.slice(0, moveIndex),
      {
        ...history[moveIndex],
        branchedHistories: nextBranchedHistories,
      },
      ...history.slice(moveIndex + 1),
    ];

    return [nextHistory, [moveIndex, 0, 0]];
  }

  if (typeof chessHistoryIndex === 'number' && chessHistoryIndex < history.length - 1) {
    const nextHistory = [
      ...history.slice(0, chessHistoryIndex),
      {
        ...history[chessHistoryIndex],
        branchedHistories: [[m]],
      },
      ...history.slice(chessHistoryIndex + 1),
    ];

    return [nextHistory, [chessHistoryIndex, 0, 0]];
  }

  const nextHistory = [...(history || []), m];
  return [nextHistory, nextHistory.length - 1];
};

export const getChessHistoryAtIndex = (
  history: RecursiveChessHistory,
  index?: ChessHistoryIndex
): LinearChessHistory => {
  if (index === undefined) {
    return history;
  }

  if (typeof index === 'number') {
    return history.slice(0, index + 1);
  }

  const [moveIndex, branchIndex, nestedBranchedHistoryOrMoveIndex] = index;

  const move = history[moveIndex];

  if (!move) {
    return []; // return an empty history if index is out of bounderies
  }

  // If the move doesn't have branches just slice it up to the move index
  if (!move.branchedHistories) {
    return history.slice(0, moveIndex + 1);
  }

  // If the given branch doesn't exist just slice it up to the move index
  if (!move.branchedHistories[branchIndex]) {
    return history.slice(0, moveIndex + 1);
  }

  return [
    ...history.slice(0, moveIndex + 1),
    ...getChessHistoryAtIndex(
      move.branchedHistories[branchIndex],
      nestedBranchedHistoryOrMoveIndex
    ),
  ];
};

export const incrementChessHistoryIndex = (index?: ChessHistoryIndex): ChessHistoryIndex => {
  if (index === undefined) {
    return 0;
  }

  if (typeof index === 'number') {
    return index + 1;
  }

  return [index[0], index[1], incrementChessHistoryIndex(index[2])];
};

export const decrementChessHistoryIndex = (index?: ChessHistoryIndex): ChessHistoryIndex => {
  if (index === undefined) {
    return 0;
  }

  if (typeof index === 'number') {
    return index - 1;
  }

  const nestedBranchedIndex = decrementChessHistoryIndex(index[2]);

  // If the nested branched index is smaller than 0 it means the branch is exhausted
  //  and it's time to jump to the root move
  if (typeof nestedBranchedIndex === 'number' && nestedBranchedIndex < 0) {
    return index[0];
  }

  return [index[0], index[1], nestedBranchedIndex];
};

export const isChessHistoryIndexHigherThan = (
  comparingIndex: ChessHistoryIndex,
  toIndex: ChessHistoryIndex
) => normalizeChessHistoryIndex(comparingIndex) > normalizeChessHistoryIndex(toIndex);

export const isChessHistoryIndexLowerThan = (
  comparingIndex: ChessHistoryIndex,
  toIndex: ChessHistoryIndex
) => isChessHistoryIndexHigherThan(toIndex, comparingIndex);

export const isChessHistoryIndexEqualTo = (
  comparingIndex: ChessHistoryIndex,
  toIndex: ChessHistoryIndex
) =>
  !(
    isChessHistoryIndexHigherThan(comparingIndex, toIndex) ||
    isChessHistoryIndexLowerThan(comparingIndex, toIndex)
  );

export const normalizeChessHistoryIndex = (index: ChessHistoryIndex = 0): number => {
  if (typeof index === 'number') {
    return index; // add the 2 other 0s so it's equal to the nested return
  }

  const [_, __, nestedMoveIndex] = index;

  // const denormalizedNestedMoveIndex =
  //   typeof nestedMoveIndex === 'number' ? nestedMoveIndex / 100 : nestedMoveIndex;

  const flattendBranchIndex = normalizeChessHistoryIndex(nestedMoveIndex);

  const next = Number(
    `${index[0]}${index[1]}${flattendBranchIndex > 0 ? flattendBranchIndex : ''}`
  );

  return next;
};

export const getChessHistoryMoveIndex = (index?: ChessHistoryIndex): number => {
  if (index === undefined) {
    return 0;
  }

  if (typeof index === 'number') {
    return index;
  }

  return index[0] + getChessHistoryMoveIndex(index[2]);
};

export const getHistoryBranch = (
  history: ChessAnalyisHistory,
  fromIndex?: ChessHistoryIndex
): ChessAnalyisHistory => {
  // If it's already a number (moveIndex) the actual history is the correct branch
  if (typeof fromIndex === 'number' || fromIndex === undefined) {
    return history;
  }

  const [moveIndex, branchIndex, nestedBranchedHistoryOrMoveIndex] = fromIndex;

  const move = history[moveIndex];

  // If the move doesn't exist just return the history
  if (!move) {
    return history;
  }

  // If the move doesn't have branches just return the history
  if (!move.branchedHistories) {
    return history;
  }

  // If the given branch doesn't exist just return the history
  if (!move.branchedHistories[branchIndex]) {
    return history;
  }

  return [
    ...history.slice(0, moveIndex + 1),
    ...getHistoryBranch(move.branchedHistories[branchIndex], nestedBranchedHistoryOrMoveIndex),
  ];
};

export const getBranchedHistoryLastIndex = (
  history: ChessAnalyisHistory,
  fromIndex?: ChessHistoryIndex
): ChessHistoryIndex => {
  // If it's already a number (moveIndex) the actual history is the correct branch
  if (typeof fromIndex === 'number' || fromIndex === undefined) {
    return history.length - 1;
  }

  const [moveIndex, branchIndex, nestedBranchedHistoryOrMoveIndex] = fromIndex;

  const move = history[moveIndex];

  // If the move doesn't exist just return the last in history
  if (!move) {
    return history.length - 1;
  }

  // If the move doesn't have branches just return the last in history
  if (!move.branchedHistories) {
    return history.length - 1;
  }

  // If the given branch doesn't exist just return the last in history
  if (!move.branchedHistories[branchIndex]) {
    return history.length - 1;
  }

  return [
    moveIndex,
    branchIndex,
    getBranchedHistoryLastIndex(
      move.branchedHistories[branchIndex],
      nestedBranchedHistoryOrMoveIndex
    ),
  ];
};

// const isEqual = (aIndex?: ChessHistoryIndex, bIndex?: ChessHistoryIndex): boolean => {
//   if (aIndex === undefined && bIndex === undefined) {
//     return true;
//   }

//   if (typeof aIndex === 'number' && typeof bIndex === 'number') {
//     return aIndex === bIndex;
//   }

//   if (isBranchedHistoryIndex(aIndex) && isBranchedHistoryIndex(bIndex)) {
//     return aIndex[0] === bIndex[0] && aIndex[1] === bIndex[1] && isEqual(aIndex[2], bIndex[2]);
//   }

//   return false;
// };
