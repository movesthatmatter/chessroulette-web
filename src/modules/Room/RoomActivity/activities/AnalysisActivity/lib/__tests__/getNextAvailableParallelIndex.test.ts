import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { seconds } from 'src/lib/time';
import { pgnToChessHistory } from 'src/mocks/records';
import {
  addMoveToChessHistory,
  ChessAnalysisHistory,
  getNextAvailableParallelIndex,
} from '../analysisHistory';


test('empty history w/o given index', () => {
  const history: ChessAnalysisHistory = [];

  const actual = getNextAvailableParallelIndex(history);
  const expected = 0;

  expect(actual).toEqual(expected);
});

test('history without branches w/o given index', () => {
  const pgn = '1. e4 c5 2. Nf3';
  const history: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const actual = getNextAvailableParallelIndex(history);
  const expected = 3;

  expect(actual).toEqual(expected);
});

test('history without branches w given index as number', () => {
  const pgn = '1. e4 c5 2. Nf3';
  const history: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const actual = getNextAvailableParallelIndex(history, 2);
  const expected = [2, 0];

  expect(actual).toEqual(expected);
});

test('history without branches w given index as number out of boundaries', () => {
  const pgn = '1. e4 c5 2. Nf3';
  const history: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const actual = getNextAvailableParallelIndex(history, 200);
  const expected = 3;

  expect(actual).toEqual(expected);
});

test('history without branches w given index as NestedBranchIndex out of boundaries', () => {
  const pgn = '1. e4 c5 2. Nf3';
  const history: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const actual = getNextAvailableParallelIndex(history, [200, 0, 1]);
  const expected = 3;

  expect(actual).toEqual(expected);
});

test('history without branches w given index and existing move w/o prior branches', () => {
  const pgn = '1. e4 c5 2. Nf3';
  const history: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const actual = getNextAvailableParallelIndex(history, 2);
  const expected = [2, 0];

  expect(actual).toEqual(expected);
});

test('history with branches w/o given index', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const nestedMoves = [
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

  const nestedMoveIndex = 1;
  const nestedBranchIndex = 0;

  const nestedHistory = nestedMoves.reduce(
    (prev, nextMove) =>
      addMoveToChessHistory(prev, nextMove, [nestedMoveIndex, nestedBranchIndex])[0],
    history
  );

  const actual = getNextAvailableParallelIndex(nestedHistory);
  const expected = 3;

  expect(actual).toEqual(expected);
});

test('history with 1 level branch w given Nested Branched Index and move with existing branches', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const nestedMoves = [
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

  const nestedMoveIndex = 1;
  const nestedBranchIndex = 0;

  const nestedHistory = nestedMoves.reduce(
    (prev, nextMove) =>
      addMoveToChessHistory(prev, nextMove, [nestedMoveIndex, nestedBranchIndex])[0],
    history
  );

  const actual = getNextAvailableParallelIndex(nestedHistory, nestedMoveIndex);
  const expected = [1, 1];

  expect(actual).toEqual(expected);
});

test('history with 2nd level branch w given Nested Branched Index and move with existing branches', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalysisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const nestedMoves = [
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

  const nestedMoveIndex = 1;
  const nestedBranchIndex = 0;

  const nestedHistory = nestedMoves.reduce(
    (prev, nextMove) =>
      addMoveToChessHistory(prev, nextMove, [nestedMoveIndex, nestedBranchIndex])[0],
    history
  );

  const nestedLvl2Moves = [
    {
      from: 'h7',
      to: 'h6',
      san: 'h6',
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
    {
      from: 'h6',
      to: 'h5',
      san: 'h5',
      color: 'black',
      clock: seconds(1),
    },
  ] as const;

  const nestedLvl2MoveIndex = 0;
  const nestedLvl2BranchIndex = 0;

  const nestedLvl2History = nestedLvl2Moves.reduce(
    (prev, nextMove) =>
      addMoveToChessHistory(prev, nextMove, [
        nestedMoveIndex,
        nestedBranchIndex,
        [nestedLvl2MoveIndex, nestedLvl2BranchIndex],
      ])[0],
    nestedHistory
  );

  const actual = getNextAvailableParallelIndex(nestedLvl2History, [
    nestedMoveIndex,
    nestedBranchIndex,
    [nestedLvl2MoveIndex, nestedLvl2BranchIndex, 1],
  ]);
  const expected = [
    nestedMoveIndex,
    nestedBranchIndex,
    [nestedLvl2MoveIndex, nestedLvl2BranchIndex, [1, 0]],
  ];

  expect(actual).toEqual(expected);
});
