import { isLeft, Either } from 'fp-ts/lib/Either';
import { Err, Ok, Result } from 'ts-results';

export const eitherToResult = <T, E>(either: Either<E, T>): Result<T, E> => {
  if (isLeft(either)) {
    return new Err(either.left);
  }

  return new Ok(either.right);
};
