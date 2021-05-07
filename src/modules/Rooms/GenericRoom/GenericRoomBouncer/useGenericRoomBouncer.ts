import useInstance from '@use-it/instance';
import { useEffect, useState } from 'react';
import { AVStreaming, getAVStreaming } from 'src/services/AVStreaming';
import {
  grantPermissionsAction,
  confirmJoiningRoomAction,
  agreePermissionsRequestAction,
  refuseBrowserSuppport,
  checkRoomAction,
  refusePermissionsAction,
} from './reducer';
import isWebViewUA from 'is-ua-webview';
import { useDispatch, useSelector } from 'react-redux';
import { selectroomBouncerState } from './selectors';
import { AsyncResult, RoomRecord } from 'dstnd-io';

export const useGenericRoomBouncer = (roomSlug: RoomRecord['slug'], checkOnMount = false) => {
  const state = useSelector(selectroomBouncerState);
  const [permissionsCheckLoading, setPermissionsCheckLoading] = useState(false);
  const dispatch = useDispatch();
  const AVStreaming = useInstance<AVStreaming>(getAVStreaming);

  const agreeWithPermissionsRequest = () => {
    dispatch(agreePermissionsRequestAction());
  };

  const checkPermissions = () => {
    setPermissionsCheckLoading(true);

    return AVStreaming
      .hasPermission()
      .map(AsyncResult.passThrough((granted) => {
        if (granted) {
          dispatch(grantPermissionsAction());
        } else {
          dispatch(refusePermissionsAction());
        }

        setPermissionsCheckLoading(false);
      }));
  };

  const checkBrowserSupport = () => {
    const supported = !isWebViewUA(navigator.userAgent);

    if (!supported) {
      dispatch(refuseBrowserSuppport());
    }

    return supported;
  };

  const checkAll = () => {
    return checkBrowserSupport() && checkPermissions();
  };

  const confirm = () => {
    dispatch(confirmJoiningRoomAction({ roomSlug }));
  };

  // This always has to go before other onMount checks!
  useEffect(() => {
    // This only cares about the initial state
    if (state && state.permissionsGranted === undefined) {
      checkPermissions()
        .map(() => {
          dispatch(checkRoomAction({ roomSlug }));
        });
    } else {
      dispatch(checkRoomAction({ roomSlug }));
    }
  }, []);

  // useEffect(() => {
  //   if (checkOnMount) {
  //     checkAll();
  //   }
  // }, [checkOnMount]);

  return {
    state,
    permissionsCheckLoading,
    agreeWithPermissionsRequest,
    checkPermissions,
    checkAll,
    checkBrowserSupport,
    confirm,

    dangerouslyGrantPermissions: () => {
      dispatch(grantPermissionsAction);
    },
  };
};
