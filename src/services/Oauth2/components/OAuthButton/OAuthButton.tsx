import React, { useState, useEffect } from 'react';
import { Button, ButtonProps } from 'src/components/Button';
import ReactPopout from 'react-popout';
import { WindowWithOnTokenReceived } from '../../types';
import { ExternalVendor } from 'dstnd-io';


type Props = Omit<ButtonProps, 'onClick'> & {
  onSuccess: (token: string) => void;
  getOauthUrl: () => Promise<string>;
  vendor: ExternalVendor;
};

const getUniqueKey = () => String(Math.random()).slice(-7);

export const OAuthButton: React.FC<Props> = (props) => {
  const [redirectUri, setRedirectUri] = useState<string | undefined>(undefined);

  // This is needed to trick the Popout to rerender
  // Otherwise, if once opened, it won't reopen
  const [popupWindowKey, setPopupWindowKey] = useState(getUniqueKey());

  // Provide the onTokenReceived method
  useEffect(() => {
    const fnName = props.vendor === 'lichess' ? 'onTokenReceivedLichess' : 'onTokenReceivedFacebook';

    (window.self as WindowWithOnTokenReceived)[fnName] = (token: string) => {
      if (typeof token === 'string') {
        setRedirectUri(undefined);

        props.onSuccess(token);
      }
    };

    return () => {
      delete (window.self as WindowWithOnTokenReceived)[fnName];
    };
  }, []);

  return (
    <>
      <Button
        onClick={async () => {
          setPopupWindowKey(getUniqueKey());

          props.getOauthUrl().then(setRedirectUri);
        }}
        {...props}
      />
      {redirectUri && (
        <ReactPopout
          key={popupWindowKey}
          url={redirectUri}
          options={{
            height: '700px',
            width: '600px',
          }}
        />
      )}
    </>
  );
};
