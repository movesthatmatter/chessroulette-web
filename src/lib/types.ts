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
