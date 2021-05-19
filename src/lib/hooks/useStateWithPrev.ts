import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

type StateWithPrev<S> = {
  current: S;
  prev: S;
}

/**
 * Use this when you need to get the prev state in one Pair
 *
 * @param initialState
 */
export function useStateWithPrev<S>(initialState: S): [StateWithPrev<S>, Dispatch<SetStateAction<S>>];
export function useStateWithPrev<S = undefined>(): [
  StateWithPrev<S | undefined>,
  Dispatch<SetStateAction<S | undefined>>
];
export function useStateWithPrev<S>(initialState?: S) {
  const [state, setState] = useState({
    current: initialState,
    prev: initialState,
  });

  type GetNextState = S | ((p: S) => S);

  const update = useCallback(
    (getNextState: GetNextState) => {
      setState((prev) => ({
        current:
          typeof getNextState === 'function' ? (getNextState as any)(prev.current) : getNextState,
        prev: prev.current,
      }));
    },
    [setState]
  );

  const [res, setRes] = useState<[typeof state, typeof update]>([state, update]);

  useEffect(() => {
    setRes([state, update]);
  }, [state, update]);

  return res;
}
