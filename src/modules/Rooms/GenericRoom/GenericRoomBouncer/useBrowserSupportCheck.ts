import { useEffect } from 'react';
import {
  refuseBrowserSuppport,
} from './reducer';
import isWebViewUA from 'is-ua-webview';
import { useDispatch, useSelector } from 'react-redux';
import { selectroomBouncerState } from './selectors';

export const useBrowserSupportCheck = (checkOnMount = true) => {
  const state = useSelector(selectroomBouncerState);
  const dispatch = useDispatch();

  const checkBrowserSupport = () => {
    const supported = !isWebViewUA(navigator.userAgent);

    if (!supported) {
      dispatch(refuseBrowserSuppport());
    }

    return supported;
  };

  // useEffect(() => {
  //   if (checkOnMount) {
  //     checkBrowserSupport();
  //   }
  // }, [checkOnMount]);

  return {
    // Default to true until a check called from
    // a specific place sets it to false!
    isBrowserSupported: state ? state.browserIsSupported : true,
    checkBrowserSupport,
  };
};
