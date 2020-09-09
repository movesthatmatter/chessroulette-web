import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Button } from 'src/components/Button';
import { http } from 'src/lib/http';
import WindowOpener from 'react-window-opener';
import ReactPopout from 'react-popout';
import {
  io,
  authenticationRedirectUrlResponsePayload,
  getLichessUserRequestPayload,
  getLichessUserResponsePayload,
} from 'dstnd-io';
import { noop } from 'src/lib/util';
import { useDispatch } from 'react-redux';
import { Box } from 'grommet';
import { WindowWithOnTokenReceived } from '../types';
import { authenticate } from '../../resources';
// import { setUser } from '../../effects';
import { setUserAction } from '../../actions';
import { authenticateViaExternalAccount } from '../../effects';

type Props = {};

export const LichessAuthButton: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [redirectUri, setRedirectUri] = useState<string | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);

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

    dispatch(
      authenticateViaExternalAccount({
        externalAccountType: 'lichess',
        externalAccountToken: token,
      })
    );
  }, [token]);

  return (
    <>
      <Box>
        <Button
          label="Lichess Login"
          primary
          size="small"
          onClick={async () => {
            const { data } = await http.get('api/auth/lichess/url');

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
            url={redirectUri}
            options={{
              height: '700px',
              width: '600px',
            }}
          />
        )}
      </Box>
    </>
  );
};

const useStyles = createUseStyles({
  container: {},
});
