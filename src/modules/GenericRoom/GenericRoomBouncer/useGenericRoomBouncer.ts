import useInstance from '@use-it/instance';
import { useEffect, useReducer, useRef } from 'react';
import { AVStreaming, getAVStreaming } from 'src/services/AVStreaming';
import { grantPermissionsAction, initialState, reducer } from './reducer';

export const useGenericRoomBouncer = (checkOnMount = false) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const AVStreaming = useInstance<AVStreaming>(getAVStreaming);

  const checkPermissions = () => {
    AVStreaming.hasPermission().map(() => {
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
