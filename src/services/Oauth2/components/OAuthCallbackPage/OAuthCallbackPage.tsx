import { ExternalVendor } from 'dstnd-io';
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect } from 'react';
import { WindowWithOnTokenReceived } from '../../types';

type Props = {
  vendor: ExternalVendor;
};

export const OAuthCallbackPage: React.FC<Props> = (props) => {
  useEffect(() => {
    const token = window.location.search.substr('?token='.length);

    if (typeof token === 'string' && token.length > 0) {
      if (props.vendor === 'facebook') {
        (window.opener as WindowWithOnTokenReceived).onTokenReceivedFacebook?.(token);
      } else if (props.vendor === 'lichess') {
        (window.opener as WindowWithOnTokenReceived).onTokenReceivedLichess?.(token);
      }
      window.close();
    }
  }, []);

  return null;
};
