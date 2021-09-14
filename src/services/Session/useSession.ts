import { useDispatch, useSelector } from 'react-redux';
import { selectSession } from './selector';
import { setSessionAction } from './reducer';
import { useEffect } from 'react';

type TValue = unknown;
type TValueSetter<T extends TValue> = (valueGetter: T | ((prev: T) => T)) => void;

export function useSession<T extends TValue>(
  key: string
): [T | undefined, TValueSetter<T | undefined>];
export function useSession<T extends TValue>(key: string, defaultValue: T): [T, TValueSetter<T>];
export function useSession<T>(key: string, defaultValue?: T) {
  const dispatch = useDispatch();
  const existentValue = useSelector(selectSession)[key] as T;

  // This only needs to happen on mount
  useEffect(() => {
    if (!existentValue) {
      dispatch(setSessionAction({ key, value: defaultValue }));
    }
  }, []);

  const currentValue = typeof existentValue !== 'undefined' ? existentValue : defaultValue;

  return [
    currentValue,
    (valueGetter: T | ((prev: T) => T)) => {
      const value =
        typeof valueGetter === 'function' ? (valueGetter as any)(currentValue) : valueGetter;

      dispatch(
        setSessionAction({
          key,
          value,
        })
      );
    },
  ];
}
