import { useCallback, useEffect, useRef, useState } from 'react';
import { noop } from '../util';

export function useStateWithCallback<S>(initialState: S) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef<Function | null>(null); // init mutable ref container for callbacks

  const setStateCallback = useCallback<
    (state: S | ((prev: S) => S), cb?: (next: S) => void) => void
  >(
    (state, cb = noop) => {
      cbRef.current = cb; // store current, passed callback in ref
      setState(state);
    },
    [] // keep object reference stable, exactly like `useState`
  );

  useEffect(() => {
    // cb.current is `null` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback] as const;
}
