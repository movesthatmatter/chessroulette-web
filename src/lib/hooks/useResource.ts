import { useCallback, useMemo, useState } from 'react';
import { AsyncResult } from 'ts-async-results';

type State<E> =
  | {
      isLoading: true;
      hasFailed: false;
      error?: undefined;
    }
  | {
      isLoading: false;
      hasFailed: true;
      error: E;
    }
  | {
      isLoading: false;
      hasFailed: false;
      error?: undefined;
    };

export const useResource = <T, E, P extends Parameters<any>, R extends AsyncResult<T, E>>(
  fn: (...p: P) => R
) => {
  const request = useCallback(
    (...args: P) => {
      setState({
        isLoading: true,
        hasFailed: false,
      });
      return fn(...args)
        .map(
          AsyncResult.passThrough(() => {
            setState({
              isLoading: false,
              hasFailed: false,
            });
          })
        )
        .mapErr(
          AsyncResult.passThrough((error) => {
            setState({
              isLoading: false,
              hasFailed: true,
              error,
            });
          })
        ) as R; // need to recast!
    },
    [fn]
  );

  const [state, setState] = useState<State<E>>({
    isLoading: false,
    hasFailed: false,
  });

  const res = useMemo(
    () => ({
      ...state,
      request,
    }),
    [request, state]
  );

  return res;
};
