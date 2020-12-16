import { useEffect, DependencyList, useRef } from 'react';
import { noop } from '../util';

export const useWillUnmount = (fn: () => void, deps: DependencyList = []) => {  
  const savedCallback = useRef(noop);

  // Update the callback any time it or the deps change
  useEffect(() => {
    savedCallback.current = fn;
  }, [fn, ...deps]);

  // Unmounter
  useEffect(() => {
    return () => {
      savedCallback.current();
    };
  }, []);
};
