import { useCallback, useMemo, useState } from 'react';
import { AsyncOk, AsyncResult } from 'ts-async-results';

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

type Opts = {
  withCache?: boolean;
  // Add expiry?
};

export const useResource = <T, E, P extends Parameters<any>, R extends AsyncResult<T, E>>(
  fn: (...p: P) => R,
  { withCache = true }: Opts = {}
) => {
  const [cache, setCache] = useState<T>();

  const request = useCallback(
    (...args: P) => {
      setState({
        isLoading: true,
        hasFailed: false,
      });

      // if (cache) {
      //   return new AsyncOk(cache);
      // }

      return fn(...args)
        .map(
          AsyncResult.passThrough((data) => {
            setState({
              isLoading: false,
              hasFailed: false,
            });

            if (withCache) {
              setCache(data);
            }
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

  const clearCache = useCallback(() => {
    setCache(undefined);
  }, []);

  // This simply clears the cache before requesting again
  const forceRequest = useCallback(
    (...args: P) => {
      clearCache();

      return request(...args);
    },
    [clearCache, request]
  );

  const [state, setState] = useState<State<E>>({
    isLoading: false,
    hasFailed: false,
  });

  const res = useMemo(
    () => ({
      ...state,
      request,
      clearCache,
      forceRequest,
    }),
    [request, state]
  );

  return res;
};
