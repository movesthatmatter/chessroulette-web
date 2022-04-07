import { useCallback, useMemo, useState } from 'react';
import { AsyncResult } from 'ts-async-results';

export const useResource = <T, E, P extends Parameters<any>, R extends AsyncResult<T, E>>(
  fn: (...p: P) => R
) => {
  const [isLoading, setIsLoading] = useState(false);

  const request = useCallback(
    (...args: P) => {
      setIsLoading(true);
      return fn(...args)
        .map(
          AsyncResult.passThrough(() => {
            setIsLoading(false);
          })
        )
        .mapErr(
          AsyncResult.passThrough(() => {
            setIsLoading(false);
          })
        ) as R; // need to recast!
    },
    [fn]
  );

  const state = useMemo(
    () => ({
      request,
      isLoading,
    }),
    [request, isLoading]
  );

  return state;
};
