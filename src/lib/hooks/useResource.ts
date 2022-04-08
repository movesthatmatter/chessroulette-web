import { addMilliseconds } from 'date-fns';
import { ISODateTime, toISODateTime } from 'io-ts-isodatetime';
import { useCallback, useMemo, useState } from 'react';
import { isDateInTheFuture } from 'src/modules/Room/util';
import { useSession } from 'src/services/Session';
import { AsyncOk, AsyncResult } from 'ts-async-results';
import { Date } from 'window-or-global';
import { delay } from '../time';
import { hashCyrb53 } from '../util';
import { promiseToAsyncResult } from '../utils';

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
  cacheSource?: 'session' | 'memory';
  cacheTTL?: number;
};

const defaultCacheTTL = 3 * 1000 * 60; // 3 mins

type CachedRecord<T> = {
  expireAt: ISODateTime;
  data: T;
};

export const useResource = <T, E, P extends Parameters<any>, R extends AsyncResult<T, E>>(
  fn: (...p: P) => R,
  { withCache = false, cacheSource = 'memory', cacheTTL = defaultCacheTTL }: Opts = {}
) => {
  const cacheName = useMemo(() => `resource-cache:${hashCyrb53(fn.toString())}`, [fn]);
  const [cache, setCache] = useSession<CachedRecord<T> | undefined>(cacheName);

  const request = useCallback(
    (...args: P) => {
      const now = new Date();

      // If there is unexpired cache use that
      if (withCache && cache && isDateInTheFuture(cache.expireAt)) {
        return (new AsyncOk(cache.data) as unknown) as R;
      }

      setState({
        isLoading: true,
        hasFailed: false,
      });

      return fn(...args)
        .map(
          AsyncResult.passThrough((data) => {
            setState({
              isLoading: false,
              hasFailed: false,
            });

            if (withCache) {
              setCache({
                expireAt: toISODateTime(addMilliseconds(now, cacheTTL)),
                data,
              });
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
    [fn, cache]
  );

  const clearCache = useCallback(() => {
    setCache(undefined);
  }, [setCache]);

  // This simply clears the cache before requesting again
  const forceRequest = useCallback(
    (...args: P) => {
      clearCache();

      // TODO: Fix this. for some reason the cache doesn't invalidate!!!
      return promiseToAsyncResult(delay(1000)).flatMap(() => request(...args)) as R;
    },
    [clearCache, request, cache]
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

export const useCachedResource = <T, E, P extends Parameters<any>, R extends AsyncResult<T, E>>(
  fn: (...p: P) => R,
  { cacheSource = 'memory', cacheTTL = defaultCacheTTL }: Opts = {}
) => useResource(fn, { withCache: true, cacheSource, cacheTTL });
