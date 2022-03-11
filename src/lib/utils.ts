import { AsyncResultWrapper } from 'ts-async-results';
import { Err, Ok } from 'ts-results';

export const promiseToAsyncResult = <T, E>(promise: Promise<T>) => {
  return new AsyncResultWrapper<T, E>(
    promise.then(
      (m) => new Ok(m),
      (e) => new Err(e)
    )
  );
};
