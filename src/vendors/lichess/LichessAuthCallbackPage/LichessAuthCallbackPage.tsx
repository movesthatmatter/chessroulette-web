/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect } from 'react';
import { WindowWithOnTokenReceived } from '../types';

type Props = {};

export const LichessAuthCallbackPage: React.FC<Props> = (props) => {
  useEffect(() => {
    const token = window.location.search.substr('?token='.length);

    if (typeof token === 'string' && token.length > 0) {
      (window.opener as WindowWithOnTokenReceived).onTokenReceived?.(token);
      window.close();
    }
  }, []);

  return null;
};
