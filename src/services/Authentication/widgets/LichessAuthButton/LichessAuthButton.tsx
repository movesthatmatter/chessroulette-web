import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Button } from 'src/components/Button';
import { http } from 'src/lib/http';
import ReactPopout from 'react-popout';
import { io, authenticationRedirectUrlResponsePayload } from 'dstnd-io';
import { useDispatch } from 'react-redux';
import { WindowWithOnTokenReceived } from '../types';
import { authenticateViaExternalAccountEffect } from '../../effects';

type Props = {};

export const LichessAuthButton: React.FC<Props> = () => {
  const cls = useStyles();
  const [redirectUri, setRedirectUri] = useState<string | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);

  // This is needed to trick the Popout to rerender
  // Otherwise, if once opened, it won't reopen
  const [popupWindowKey, setPopupWindowKey] = useState(Math.random());

  const dispatch = useDispatch();

  // Provide the onTokenReceived method
  useEffect(() => {
    (window.self as WindowWithOnTokenReceived).onTokenReceived = (
      msg: string
    ) => {
      if (typeof msg === 'string') {
        setToken(msg);
      }
    };

    return () => {
      delete (window.self as WindowWithOnTokenReceived).onTokenReceived;
    };
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    setRedirectUri(undefined);

    dispatch(
      authenticateViaExternalAccountEffect({
        externalAccountType: 'lichess',
        externalAccountToken: token,
      })
    );
  }, [token]);

  return (
    <>
      <Button
        label="Lichess Login"
        primary
        onClick={async () => {
          const { data } = await http.get('api/auth/lichess/url');

          setPopupWindowKey(Math.random());

          io.deserialize(authenticationRedirectUrlResponsePayload, data).map(
            ({ redirectUrl }) => {
              setRedirectUri(redirectUrl);
            }
          );
        }}
        className={cls.container}
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

const useStyles = createUseStyles({
  container: {},
});
