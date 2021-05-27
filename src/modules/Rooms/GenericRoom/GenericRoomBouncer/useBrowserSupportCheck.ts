import { refuseBrowserSuppport } from './reducer';
import isWebViewUA from 'is-ua-webview';
import { useDispatch, useSelector } from 'react-redux';
import { selectroomBouncerState } from './selectors';

export const useBrowserSupportCheck = () => {
  const state = useSelector(selectroomBouncerState);
  const dispatch = useDispatch();

  const checkBrowserSupport = () => {
    const supported = !isWebViewUA(navigator.userAgent);

    if (!supported) {
      dispatch(refuseBrowserSuppport());
    }

    return supported;
  };

  return {
    isBrowserUnsupported: !!state?.browserIsUnsupported,
    checkBrowserSupport,
  };
};
