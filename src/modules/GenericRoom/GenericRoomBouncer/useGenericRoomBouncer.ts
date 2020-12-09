import { useEffect, useReducer, useRef } from 'react';
import { getAVStreaming } from 'src/services/AVStreaming';
import { grantPermissionsAction, initialState, reducer } from './reducer';

export const useGenericRoomBouncer = (checkOnMount = false) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const avStreamingRef = useRef(getAVStreaming()).current;

  const checkPermissions = () => {
    avStreamingRef.hasPermission().map(() => {
      dispatch(grantPermissionsAction);
    });
  };

  const checkAll = () => {
    checkPermissions();
  }

  useEffect(() => {
    if (checkOnMount) {
      checkAll();
    }
  }, [checkOnMount]);

  return {
    state,
    checkPermissions,
    checkAll,

    dangerouslyGrantPermissions: () => {
      dispatch(grantPermissionsAction);
    },
  };
};
