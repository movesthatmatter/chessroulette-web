import { useCallback, useEffect, useRef, useState } from 'react';
import { noop } from '../util';

// Unshamefullly Stolen from https://stackoverflow.com/a/61842546/2093626
// Also, check this other one with a better explnation https://stackoverflow.com/a/61725731/2093626
//
// This implements the this.setState(newState, cb) functionality
// The only drawback is:
//   - If the passed arrow function references a variable outer function,
//     then it will capture current value not a value after the state is updated.
//
//   So keep this drawback in mind, bu tin practice it shouldn't be too hard to not have to do that!
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
