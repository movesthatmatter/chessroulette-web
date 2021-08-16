import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { seconds } from 'src/lib/time';
import { pgnToChessHistory } from 'src/mocks/records';
import { addMoveToChessHistory, ChessAnalyisHistory, getHistoryBranch } from '../analysisHistory';
import { printHistory } from '../testUtil';

test('empty history', () => {
  const history: ChessAnalyisHistory = [];

  const actual = getHistoryBranch(history);
  const expected: ChessAnalyisHistory = [];

  expect(actual).toEqual(expected);
});

test('history without branches w/o given index', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalyisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const actual = getHistoryBranch(history);
  const expected: ChessAnalyisHistory = history;

  expect(actual).toEqual(expected);
});

test('history without branches w given index as number', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalyisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const actual = getHistoryBranch(history, 2);
  const expected: ChessAnalyisHistory = history;

  expect(actual).toEqual(expected);
});

test('history without branches w given index as number out of boundaries', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalyisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const actual = getHistoryBranch(history, 200);
  const expected: ChessAnalyisHistory = history;

  expect(actual).toEqual(expected);
});

test('history without branches w given index as branchIndex', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalyisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const actual = getHistoryBranch(history, [0, 0, 1]);
  const expected: ChessAnalyisHistory = history;

  expect(actual).toEqual(expected);
});

test('history without branches w given index as branchIndex and move Index out of boundaries', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalyisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const actual = getHistoryBranch(history, [200, 0, 1]);
  const expected: ChessAnalyisHistory = history;

  expect(actual).toEqual(expected);
});

test('history with branches w/o given index', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalyisHistory = pgnToChessHistory(pgn, {
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

  const actual = getHistoryBranch(nestedHistory);
  const expected: ChessAnalyisHistory = history;

  expect(chessHistoryToSimplePgn(actual)).toEqual(chessHistoryToSimplePgn(expected));
});

test('history with level branch w given branched index', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalyisHistory = pgnToChessHistory(pgn, {
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

  const actual = chessHistoryToSimplePgn(
    getHistoryBranch(nestedHistory, [nestedMoveIndex, nestedBranchIndex])
  );
  const expected = `1. e4 c5 2. d4 d6`;

  expect(actual).toEqual(expected);
});

test('history with 2nd level branches w given branched index', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalyisHistory = pgnToChessHistory(pgn, {
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

  const actualHistory = getHistoryBranch(nestedLvl2History, [
    nestedMoveIndex,
    nestedBranchIndex,
    [nestedLvl2MoveIndex, nestedLvl2BranchIndex, 0],
  ]);
  const actual = chessHistoryToSimplePgn(actualHistory);
  const expected = `1. e4 c5 2. d4 h6 3. a3 h5`;

  expect(actual).toEqual(expected);
});

test('history with 2 parallel branches w given branched index', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessAnalyisHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const parallelMoves = [
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

  const parallelBranchHistory = parallelMoves.reduce(
    (prev, nextMove) =>
      addMoveToChessHistory(prev, nextMove, [nestedMoveIndex, nestedBranchIndex])[0],
    history
  );

  const parallel2ndBranchMoves = [
    {
      from: 'a2',
      to: 'a3',
      san: 'a3',
      color: 'white',
      clock: seconds(1),
    },
    {
      from: 'h7',
      to: 'h6',
      san: 'h6',
      color: 'black',
      clock: seconds(1),
    },
    {
      from: 'a3',
      to: 'a4',
      san: 'a4',
      color: 'white',
      clock: seconds(1),
    },
  ] as const;

  const nestedParallel2ndBranchMoveIndex = nestedMoveIndex;
  const nestedParallel2ndBranchBranchIndex = 1;

  const parallel2ndBranchHistory = parallel2ndBranchMoves.reduce(
    (prev, nextMove) =>
      addMoveToChessHistory(prev, nextMove, [
        nestedParallel2ndBranchMoveIndex,
        nestedParallel2ndBranchBranchIndex,
      ])[0],
    parallelBranchHistory
  );

  const actualHistory = getHistoryBranch(parallel2ndBranchHistory, [
    nestedParallel2ndBranchMoveIndex,
    nestedParallel2ndBranchBranchIndex,
  ]);
  const actual = chessHistoryToSimplePgn(actualHistory);
  const expected = `1. e4 c5 2. a3 h6 3. a4`;

  expect(actual).toEqual(expected);
});
