import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { noop } from 'src/lib/util';

export const useOnLeaveRoute = (onLeave: () => boolean) => {
  const unblock = useRef(noop);
  const history = useHistory();

  useEffect(() => {
    const unblockFn = history.block((location, action) => {
      const result = onLeave();

      unblock.current = () => {
        unblockFn();

        switch (action) {
          case 'PUSH':
            history.push(location);
            break;
          case 'REPLACE':
            history.replace(location);
            break;
          default:
          case 'POP':
            history.goBack();
            break;
        }
      };

      if (result === true) {
        return undefined;
      }

      return result;
    });

    return () => {
      unblockFn();
    };
  }, []);

  return unblock.current;
};
