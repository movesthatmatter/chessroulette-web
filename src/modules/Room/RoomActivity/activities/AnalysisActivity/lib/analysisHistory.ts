import { ChessHistory, ChessHistoryMove } from 'dstnd-io';

// @deprecate in favor NestedChessHistoryMove
export type ChessAnalysisMove = ChessHistoryMove & {
  branchedHistories?: ChessAnalysisHistory[] | undefined;
};

// @deprecate in favor of NestedChessHistory
export type ChessAnalysisHistory = ChessAnalysisMove[];

export type RecursiveChessHistoryMove = ChessAnalysisMove;
export type RecursiveChessHistory = ChessAnalysisHistory;

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
  history: ChessAnalysisHistory,
  m: ChessHistoryMove,
  chessHistoryIndex?: ChessHistoryIndex
): [nextHistory: ChessAnalysisHistory, nextIndex: ChessHistoryIndex] => {
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

// Adds a new move from the given index at the next availalbe slot
//  In case of a nested move it simply adds a new branch if the move not already there
//  If the move is already present as a following move (on the main or branched histories) it simply refocuses
//  Otherwise it appends it to the given history
export const addMoveToChessHistoryAtNextAvailableIndex = (
  history: ChessAnalysisHistory,
  atIndex: ChessHistoryIndex,
  move: ChessHistoryMove
) => {
  const lastIndexInBranch = getBranchedHistoryLastIndex(history, atIndex);
  // If the Branched History atIndex is the last one or not given, just append it to the current history branch
  if (!(normalizeChessHistoryIndex(atIndex) < normalizeChessHistoryIndex(lastIndexInBranch))) {
    return addMoveToChessHistory(history, move, atIndex);
  }

  const foundFollowingMoveAndIndex = getAllFollowingMoves(history, atIndex).find(
    ([m]) => m.san === move.san
  );

  // If the move is the same as an already following history branch just refocus on it
  if (foundFollowingMoveAndIndex) {
    const [_, followingFoundIndex] = foundFollowingMoveAndIndex;
    return [history, followingFoundIndex] as const;
  }

  // Otherwise add a parallel history branch for the move
  return addMoveToChessHistory(history, move, getNextAvailableParallelIndex(history, atIndex));
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

export const getMoveAtIndex = (
  history: ChessAnalysisHistory,
  index?: ChessHistoryIndex
): undefined | ChessAnalysisMove => {
  if (index === undefined) {
    return undefined;
  }

  if (typeof index === 'number') {
    return history[index];
  }

  const [moveIndex, branchIndex, nestedBranchedHistoryOrMoveIndex] = index;

  const move = history[moveIndex];

  if (!move) {
    return undefined; // return undefined
  }

  // If the move doesn't have branches return undefined
  if (!move.branchedHistories) {
    return undefined;
  }

  // If the given branch doesn't exist just return undefined
  if (!move.branchedHistories[branchIndex]) {
    return undefined;
  }

  return getMoveAtIndex(move.branchedHistories[branchIndex], nestedBranchedHistoryOrMoveIndex);
};

export const getMainFollowingMove = (history: ChessAnalysisHistory, atIndex: ChessHistoryIndex) => {
  const followingIndex = incrementChessHistoryIndex(atIndex);
  const followingMove = getMoveAtIndex(history, followingIndex);

  return followingMove ? ([followingMove, followingIndex] as const) : undefined;
};

export const getAlternativeFollowingMoves = (
  history: ChessAnalysisHistory,
  atIndex: ChessHistoryIndex
): [ChessAnalysisMove, ChessHistoryIndex][] => {
  const move = getMoveAtIndex(history, atIndex);

  if (!(move && move.branchedHistories)) {
    return [];
  }

  const deconstructedAtIndex: (BranchedHistoryIndex | number)[] = [];
  every(atIndex, (i) => deconstructedAtIndex.push(i), { reverse: true });

  return move.branchedHistories
    .map((branch, branchIndex) => {
      const branchMoveIndex = 0;
      const followingMove = branch[branchMoveIndex];

      if (!followingMove) {
        return undefined;
      }

      const reconstructedFollowingMoveIndex = deconstructedAtIndex.reduce((prev, nextIndex) => {
        // First position only
        if (typeof nextIndex === 'number') {
          return [nextIndex, branchIndex, 0];
        }

        return [nextIndex[0], nextIndex[1], prev];
      }, ([] as unknown) as BranchedHistoryIndex);

      return [followingMove, reconstructedFollowingMoveIndex] as const;
    })
    .filter((m) => !!m) as [ChessAnalysisMove, ChessHistoryIndex][];
};

// The fn params:
//   - i as number -> means it's the last one,
//   - i as BranchHistoryIndex -> means it has another nested one
export const every = (
  index: ChessHistoryIndex,
  fn: (i: BranchedHistoryIndex | number) => void,
  p: { reverse?: boolean } = {}
) => {
  if (typeof index === 'number') {
    fn(index);
    return;
  }

  const [moveIndex, branchIndex, nestedBranchedIndex] = index;

  if (p.reverse) {
    every(nestedBranchedIndex || 0, fn, p);
    fn([moveIndex, branchIndex]);
  } else {
    fn([moveIndex, branchIndex]);
    every(nestedBranchedIndex || 0, fn, p);
  }
};

export const getAllFollowingMoves = (history: ChessAnalysisHistory, atIndex: ChessHistoryIndex) => {
  const mainFollowingMove = getMainFollowingMove(history, atIndex);
  const alternativeFollowingMoves = getAlternativeFollowingMoves(history, atIndex);

  return [...(mainFollowingMove ? [mainFollowingMove] : []), ...alternativeFollowingMoves];
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
  history: ChessAnalysisHistory,
  fromIndex?: ChessHistoryIndex
): ChessAnalysisHistory => {
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
  history: ChessAnalysisHistory,
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

export const incrementChessHistoryBranchIndex = (
  index: BranchedHistoryIndex
): BranchedHistoryIndex => {
  const [moveIndex, branchIndex, nestedBranchIndex] = index;

  if (isBranchedHistoryIndex(nestedBranchIndex)) {
    return [moveIndex, branchIndex, incrementChessHistoryBranchIndex(nestedBranchIndex)];
  }

  return [moveIndex, branchIndex + 1];
};

export const getNextAvailableParallelIndex = (
  history: ChessAnalysisHistory,
  fromIndex?: ChessHistoryIndex
): ChessHistoryIndex => {
  // If the index isn't given the next avaialable position is at the end of history
  if (fromIndex === undefined) {
    return history.length;
  }

  if (typeof fromIndex === 'number') {
    const move = history[fromIndex];

    if (!move) {
      return history.length;
    }

    // If the move exists than the next available index is within a new nested branch inside the move
    return [fromIndex, (move.branchedHistories || []).length];
  }

  const [moveIndex, branchIndex, nestedBranchOrMoveIndex] = fromIndex;

  const move = history[moveIndex];

  if (!move) {
    return history.length;
  }

  // If there aren't any branches the nestedBranchOrMoveIndex doesn't matter
  //  just return the next available branch (which is the 1st one)
  if (!move.branchedHistories) {
    return [moveIndex, 0];
  }

  // If the branch index is out of range return the next available one
  if (!move.branchedHistories[branchIndex]) {
    return [moveIndex, move.branchedHistories.length];
  }

  return [
    moveIndex,
    branchIndex,
    getNextAvailableParallelIndex(move.branchedHistories[branchIndex], nestedBranchOrMoveIndex),
  ];
};
