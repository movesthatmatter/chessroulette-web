import useInstance from '@use-it/instance';
import { useEffect, useState } from 'react';
import { AVStreaming, getAVStreaming } from 'src/services/AVStreaming';
import {
  grantPermissionsAction,
  confirmJoiningRoomAction,
  agreePermissionsRequestAction,
  checkRoomAction,
  refusePermissionsAction,
} from '../redux/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { selectroomBouncerState } from '../redux/selectors';
import { AsyncResult, RoomRecord } from 'dstnd-io';
import { useBrowserSupportCheck } from './useBrowserSupportCheck';

export const useRoomBouncer = (roomSlug: RoomRecord['slug']) => {
  const state = useSelector(selectroomBouncerState);
  const [permissionsCheckLoading, setPermissionsCheckLoading] = useState(false);
  const dispatch = useDispatch();
  const AVStreaming = useInstance<AVStreaming>(getAVStreaming);
  const browserSupport = useBrowserSupportCheck();

  const agreeWithPermissionsRequest = () => {
    dispatch(agreePermissionsRequestAction({ roomSlug }));
  };

  const checkPermissions = () => {
    setPermissionsCheckLoading(true);

    return AVStreaming.hasPermission().map(
      AsyncResult.passThrough((granted) => {
        if (granted) {
          dispatch(grantPermissionsAction({ roomSlug }));
        } else {
          dispatch(refusePermissionsAction({ roomSlug }));
        }

        setPermissionsCheckLoading(false);
      })
    );
  };

  const checkAll = () => browserSupport.checkBrowserSupport() && checkPermissions();

  const confirm = () => {
    dispatch(confirmJoiningRoomAction({ roomSlug }));
  };

  // This always has to go before other onMount checks!
  useEffect(() => {
    // This only cares about the initial state
    if (state && state.permissionsGranted === undefined) {
      checkPermissions().map(() => {
        dispatch(checkRoomAction({ roomSlug }));
      });
    } else {
      dispatch(checkRoomAction({ roomSlug }));
    }
  }, []);

  return {
    state,
    permissionsCheckLoading,
    agreeWithPermissionsRequest,
    checkPermissions,
    checkAll,
    checkBrowserSupport: () => browserSupport.checkBrowserSupport(),
    confirm,

    dangerouslyGrantPermissions: () => {
      dispatch(grantPermissionsAction);
    },
  };
};
