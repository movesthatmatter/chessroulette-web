import React, { useState, useEffect } from 'react';
import { Button, ButtonProps } from 'src/components/Button';
import ReactPopout from 'react-popout';
import { VerifyLichessUserResponsePayload, } from 'dstnd-io';
import { WindowWithOnTokenReceived } from '../types';
import { getRedirectUrl, verifyLichessUser } from '../resources';


type Props = Omit<ButtonProps, 'onClick' | 'label'> & {
  label?: ButtonProps['label'];
  onSuccess: (user: VerifyLichessUserResponsePayload['user']) => void;
};

export const LichessAuthButton: React.FC<Props> = ({
  label = 'Lichess Login',
  ...props
}) => {
  const [redirectUri, setRedirectUri] = useState<string | undefined>(undefined);

  // This is needed to trick the Popout to rerender
  // Otherwise, if once opened, it won't reopen
  const [popupWindowKey, setPopupWindowKey] = useState(Math.random());

  // Provide the onTokenReceived method
  useEffect(() => {
    (window.self as WindowWithOnTokenReceived).onTokenReceived = (token: string) => {
      if (typeof token === 'string') {
        setRedirectUri(undefined);

        verifyLichessUser({ token }).map(({ user }) => {
          props.onSuccess(user);
        });
      }
    };

    return () => {
      delete (window.self as WindowWithOnTokenReceived).onTokenReceived;
    };
  }, []);

  return (
    <>
      <Button
        label={label}
        onClick={async () => {
          setPopupWindowKey(Math.random());

          getRedirectUrl().map(({ redirectUrl }) => setRedirectUri(redirectUrl));
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
