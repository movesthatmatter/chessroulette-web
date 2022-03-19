import { AsyncResult } from 'ts-async-results';

export type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * This Type ensures the given [optional] key inside the given object is required
 *
 * Eg:
 * type MyObject = {game?: string, if: string};
 *
 * type MyObjectWithGame = WithRequiredKey<MyObject, 'game'>;
 */
export type WithRequiredKey<T extends object, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Taken from here https://stackoverflow.com/a/57103940/2093626
 * Also look at here to understand why the regular Omit breaks the discribimanting union
 *  https://github.com/microsoft/TypeScript/issues/31501
 */
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

// Utils for ts-async-results
export type AnyAsyncResult = AsyncResult<any, any>;
export type UnknownAsyncResult = AsyncResult<unknown, unknown>;
export type EmptyAsyncResult = AsyncResult<void, unknown>;

export type AnyOkAsyncResult<TError> = AsyncResult<any, TError>;