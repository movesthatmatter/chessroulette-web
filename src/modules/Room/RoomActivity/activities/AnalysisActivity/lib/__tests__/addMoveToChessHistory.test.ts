import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { seconds } from 'src/lib/time';
import { pgnToChessHistory } from 'src/mocks/records';
import { addMoveToChessHistory, ChessAnalysisHistory } from '../analysisHistory';

test('empty history', () => {
  const history: ChessAnalysisHistory = [];

  const move = {
    from: 'e2',
    to: 'e4',
    san: 'e4',
    color: 'white',
    clock: seconds(10),
  } as const;

  const [actualHistory, actualIndex] = addMoveToChessHistory(history, move);

  const expectedHistory = [move];
  const expectedIndex = 0;

  expect(actualHistory).toEqual(expectedHistory);
  expect(actualIndex).toEqual(expectedIndex);
});

test('adds a further move', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const move = {
    from: 'e2',
    to: 'e4',
    san: 'e4',
    color: 'white',
    clock: seconds(10),
  } as const;

  const [actualHistory, actualIndex] = addMoveToChessHistory(history, move);

  const expectedHistory = [...history, move];
  const expectedIndex = 3;

  expect(actualHistory).toEqual(expectedHistory);
  expect(actualIndex).toEqual(expectedIndex);
});

test('adds a single branched move as white', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const originalHistory: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const displayedMoveIndex = 1;
  const branchIndex = 0;

  const move = {
    from: 'd2',
    to: 'd4',
    san: 'd4',
    color: 'white',
    clock: seconds(10),
  } as const;

  const [actualHistory, actualIndex] = addMoveToChessHistory(originalHistory, move, [
    displayedMoveIndex,
    branchIndex,
  ]);

  const expectedHistory = [
    ...originalHistory.slice(0, displayedMoveIndex),
    {
      ...originalHistory[displayedMoveIndex],
      branchedHistories: [[move]],
    },
    ...originalHistory.slice(displayedMoveIndex + 1),
  ];

  const expectedIndex = [displayedMoveIndex, branchIndex, 0];

  expect(actualHistory).toEqual(expectedHistory);
  expect(actualIndex).toEqual(expectedIndex);
});

test('adds a single branched move as black', () => {
  const pgn = '1. e4 c5 2. Nf3 Nf6';

  const originalHistory: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const displayedMoveIndex = 2;
  const branchIndex = 0;

  const move = {
    from: 'd7',
    to: 'd6',
    san: 'd6',
    color: 'black',
    clock: seconds(10),
  } as const;

  const [actualHistory, actualIndex] = addMoveToChessHistory(originalHistory, move, [
    displayedMoveIndex,
    branchIndex,
  ]);

  const expectedHistory = [
    ...originalHistory.slice(0, displayedMoveIndex),
    {
      ...originalHistory[displayedMoveIndex],
      branchedHistories: [[move]],
    },
    ...originalHistory.slice(displayedMoveIndex + 1),
  ];

  const expectedIndex = [displayedMoveIndex, branchIndex, 0];

  expect(actualHistory).toEqual(expectedHistory);
  expect(actualIndex).toEqual(expectedIndex);
});

test('adds multiple consecutive moves in one branch', () => {
  const pgn = '1. e4 c5 2. Nf3 Nf6 3. a4 a6';
  // const pgn = '1. e4 c5';

  const originalHistory: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const moves = [
    {
      from: 'd2',
      to: 'd4',
      san: 'd4',
      color: 'white',
      clock: seconds(1),
    },
    {
      from: 'd7',
      to: 'd6',
      san: 'd6',
      color: 'black',
      clock: seconds(1),
    },
    {
      from: 'a2',
      to: 'a3',
      san: 'a3',
      color: 'white',
      clock: seconds(1),
    },
  ] as const;

  const displayedMoveIndex = 1;
  const branchIndex = 0;

  const historyWithMoves = moves
    .slice(0, -1)
    .reduce(
      (prev, nextMove) =>
        addMoveToChessHistory(prev, nextMove, [displayedMoveIndex, branchIndex])[0],
      originalHistory
    );

  const [actualHistory, actualIndex] = addMoveToChessHistory(historyWithMoves, moves.slice(-1)[0], [
    displayedMoveIndex,
    branchIndex,
  ]);

  const expectedHistory = [
    ...originalHistory.slice(0, displayedMoveIndex),
    {
      ...originalHistory[displayedMoveIndex],
      branchedHistories: [moves],
    },
    ...originalHistory.slice(displayedMoveIndex + 1),
  ];

  const expectedIndex = [displayedMoveIndex, branchIndex, 2];

  expect(actualHistory).toEqual(expectedHistory);
  expect(actualIndex).toEqual(expectedIndex);
});

test('adds one move in a nested branch', () => {
  const pgn = '1. e4 c5 2. Nf3 Nf6 3. a4 a6';

  const originalHistory: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const movesBranch1 = [
    {
      from: 'd2',
      to: 'd4',
      san: 'd4',
      color: 'white',
      clock: seconds(1),
    },
    {
      from: 'd7',
      to: 'd6',
      san: 'd6',
      color: 'black',
      clock: seconds(1),
    },
  ] as const;

  const rootMoveIndex = 2;
  const rootBranchIndex = 0;

  const historyWithOneBranchedMove = movesBranch1.reduce(
    (prev, nextMove) => addMoveToChessHistory(prev, nextMove, [rootMoveIndex, rootBranchIndex])[0],
    originalHistory
  );

  const movesBranch1Nested = [
    {
      from: 'a7',
      to: 'a5',
      san: 'a5',
      color: 'black',
      clock: seconds(1),
    },
  ] as const;

  const nestedMoveIndex = 1;
  const branchIndex = 0;

  const [actualHistory, actualIndex] = addMoveToChessHistory(
    historyWithOneBranchedMove,
    movesBranch1Nested[0],
    [rootMoveIndex, branchIndex, [nestedMoveIndex, branchIndex]]
  );

  const expectedHistory = [
    ...originalHistory.slice(0, rootMoveIndex),
    {
      ...originalHistory[rootMoveIndex],
      branchedHistories: [
        [
          ...movesBranch1.slice(0, nestedMoveIndex),
          {
            ...movesBranch1[nestedMoveIndex],
            branchedHistories: [movesBranch1Nested],
          },
          ...movesBranch1.slice(nestedMoveIndex + 1),
        ],
      ],
    },
    ...originalHistory.slice(rootMoveIndex + 1),
  ];
  const expectedIndex = [rootMoveIndex, rootBranchIndex, [nestedMoveIndex, branchIndex, 0]];

  expect(actualHistory).toEqual(expectedHistory);
  expect(actualIndex).toEqual(expectedIndex);
});

test('adds one move in a parallel branch', () => {
  const pgn = '1. e4 c5 2. Nf3 Nf6 3. a4 a6';

  const originalHistory: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const movesBranch1 = [
    {
      from: 'd2',
      to: 'd4',
      san: 'd4',
      color: 'white',
      clock: seconds(1),
    },
    {
      from: 'd7',
      to: 'd6',
      san: 'd6',
      color: 'black',
      clock: seconds(1),
    },
  ] as const;

  const displayedMoveIndex = 1;

  const historyWithOneBranchedMove = movesBranch1.reduce(
    (prev, nextMove) => addMoveToChessHistory(prev, nextMove, [displayedMoveIndex, 0])[0],
    originalHistory
  );

  const movesBranch2 = [
    {
      from: 'a2',
      to: 'a4',
      san: 'a4',
      color: 'white',
      clock: seconds(1),
    },
    {
      from: 'a7',
      to: 'a5',
      san: 'a5',
      color: 'black',
      clock: seconds(1),
    },
    {
      from: 'g1',
      to: 'f3',
      san: 'Nf3',
      color: 'black',
      clock: seconds(1),
    },
  ] as const;

  const branchIndex = 1;

  const historyWithAnoterBranchedMove = movesBranch2
    .slice(0, -1)
    .reduce(
      (prev, nextMove) =>
        addMoveToChessHistory(prev, nextMove, [displayedMoveIndex, branchIndex])[0],
      historyWithOneBranchedMove
    );

  const [actualHistory, actualIndex] = addMoveToChessHistory(
    historyWithAnoterBranchedMove,
    movesBranch2.slice(-1)[0],
    [displayedMoveIndex, branchIndex]
  );

  const expectedHistory = [
    ...originalHistory.slice(0, displayedMoveIndex),
    {
      ...originalHistory[displayedMoveIndex],
      branchedHistories: [movesBranch1, movesBranch2],
    },
    ...originalHistory.slice(displayedMoveIndex + 1),
  ];

  const expectedIndex = [displayedMoveIndex, branchIndex, 2];

  expect(actualHistory).toEqual(expectedHistory);
  expect(actualIndex).toEqual(expectedIndex);
});
