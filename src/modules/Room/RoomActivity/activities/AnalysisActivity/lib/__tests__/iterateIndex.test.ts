import { every } from '../analysisHistory';

test('as number', () => {
  let actual: any[] = [];
  every(1, (index) => {
    actual.push(index);
  });

  const expected = [1];

  expect(actual).toEqual(expected);
});

test('as branched index with primitive at nested', () => {
  let actual: any[] = [];
  every([1, 0, 2], (index) => {
    actual.push(index);
  });

  const expected = [[1, 0], 2];

  expect(actual).toEqual(expected);
});

test('as branched index with nested branched index', () => {
  let actual: any[] = [];
  every([1, 0, [2, 1, 1]], (index) => {
    actual.push(index);
  });

  const expected = [[1, 0], [2, 1], 1];

  expect(actual).toEqual(expected);
});

test('as branched index with multiple nested branched index', () => {
  let actual: any[] = [];
  every([1, 0, [2, 1, [1, 2, [5, 0, [2, 0]]]]], (index) => {
    actual.push(index);
  });

  const expected = [[1, 0], [2, 1], [1, 2], [5, 0], [2, 0], 0];

  expect(actual).toEqual(expected);
});

test('as branched index with multiple nested branched index in reverse orde', () => {
  let actual: any[] = [];
  every(
    [1, 0, [2, 1, [1, 2, [5, 0, [2, 0]]]]],
    (index) => {
      actual.push(index);
    },
    { reverse: true }
  );

  const expected = [0, [2, 0], [5, 0], [1, 2], [2, 1], [1, 0]];

  expect(actual).toEqual(expected);
});
