import useInstance from '@use-it/instance';
import { useEffect } from 'react';
import { AVStreaming, getAVStreaming } from 'src/services/AVStreaming';
import {
  grantPermissionsAction,
  confirmJoiningRoomAction,
  agreePermissionsRequestAction,
  refuseBrowserSuppport,
} from './reducer';
import isWebViewUA from 'is-ua-webview';
import { useDispatch, useSelector } from 'react-redux';
import { selectroomBouncerState } from './selectors';

export const useGenericRoomBouncer = (checkOnMount = false) => {
  const state = useSelector(selectroomBouncerState);
  const dispatch = useDispatch();
  const AVStreaming = useInstance<AVStreaming>(getAVStreaming);

  const agreeWithPermissionsRequest = () => {
    dispatch(agreePermissionsRequestAction());
  };

  const checkPermissions = () => {
    AVStreaming.hasPermission().map(() => {
      dispatch(grantPermissionsAction());
    });
  };

  const checkBrowserSupport = () => {
    if (isWebViewUA(navigator.userAgent)) {
      dispatch(refuseBrowserSuppport());
    }
  };

  const checkAll = () => {
    checkPermissions();
    checkBrowserSupport();
  };

  const confirm = () => {
    dispatch(confirmJoiningRoomAction());
  };

  useEffect(() => {
    if (checkOnMount) {
      checkAll();
    }
  }, [checkOnMount]);

  return {
    state,
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
