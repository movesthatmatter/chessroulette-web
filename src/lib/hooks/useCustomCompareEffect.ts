import { useRef, useEffect } from 'react';

type MaybeCleanUpFn = void | (() => void);
type EqualFn<T> = (current: T, prev: T) => boolean;

// Take From Here https://github.com/Sanjagh/use-custom-compare-effect/blob/master/src/index.js
const useCustomCompareMemo = <T>(value: T, isEqual: EqualFn<T>): T => {
  const ref = useRef<T>(value);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
};

export const useCustomCompareEffect = <T>(
  create: () => MaybeCleanUpFn,
  input: T,
  isEqual: EqualFn<T>
) => {
  useEffect(create, [useCustomCompareMemo(input, isEqual)]);
};
