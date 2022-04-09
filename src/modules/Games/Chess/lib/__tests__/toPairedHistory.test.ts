import { ChessRecursiveHistory } from 'chessroulette-io';
import { chessGameTimeLimitMsMap } from 'chessroulette-io/dist/metadata/game';
import { pgnToChessHistory } from 'src/mocks/records';
import { toPairedHistory } from '../util';

test('regular (linear) history ending in white', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessRecursiveHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const actual = toPairedHistory(history);
  const expected = [
    [history[0], history[1]],
    [history[2]],
  ];

  expect(actual).toEqual(expected);
  expect(actual[0][0]?.san).toEqual('e4');
});

test('regular (linear) history ending in black', () => {
  const pgn = '1. e4 c5 2. Nf3 Nf6';

  const history: ChessRecursiveHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const actual = toPairedHistory(history);
  const expected = [
    [history[0], history[1]],
    [history[2], history[3]],
  ] as const;

  expect(actual).toEqual(expected);
  expect(actual[0][0]?.san).toEqual('e4');
  expect(actual[1][1]?.san).toEqual('Nf6');
});

test('history starting with a black move and ending in white', () => {
  const pgn = '1. e4 c5 2. Nf3';

  const history: ChessRecursiveHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const historyStartingWithBlack = history.slice(1);

  const actual = toPairedHistory(historyStartingWithBlack);
  const expected = [
    [history[1]],
    [history[2]],
  ];

  expect(actual).toEqual(expected);
  expect(actual[0][0]?.san).toEqual('c5');
  expect(actual[1][0]?.san).toEqual('Nf3');
});

test('history starting with a black move and ending in black', () => {
  const pgn = '1. e4 c5 2. Nf3 Nf6';

  const history: ChessRecursiveHistory = pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });

  const historyStartingWithBlack = history.slice(1);

  const actual = toPairedHistory(historyStartingWithBlack);
  const expected = [
    [history[1]],
    [history[2], history[3]],
  ];

  expect(actual).toEqual(expected);
  expect(actual[0][0]?.san).toEqual('c5');
  expect(actual[1][1]?.san).toEqual('Nf6');
});
