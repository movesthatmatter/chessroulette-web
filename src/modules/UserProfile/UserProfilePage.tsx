import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AuthenticatedPage } from 'src/components/Page';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import {
  connectExternalAccountEffect,
  updateAuthenticatedUser,
} from 'src/services/Authentication';
import { FacebookAuthButton } from 'src/vendors/facebook';
import { LichessAuthButton } from 'src/vendors/lichess';


type Props = {};

export const UserProfilePage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    // Make sure the user is up to date
    dispatch(updateAuthenticatedUser());
  }, []);

  return (
    <AuthenticatedPage render={({ user }) => (
      <>
        <div className={cls.container}>
          User Profile Page
        </div>
        <div style={{ width: 300, paddingTop: 40 }}>
          {/* <div className={cls.buttonRow}> */}
          Lichess:
          {user.externalAccounts?.lichess?.userId ? (
            <Text>Connected</Text>
          ) : (
              <LichessAuthButton
                full
                label="Lichess"
                type="secondary"
                onSuccess={async (accessToken) => {
                  dispatch(
                    connectExternalAccountEffect({
                      vendor: 'lichess',
                      accessToken,
                    }),
                  );
                }}
              />
            )}
          {/* <div style={{ width: '16px' }} /> */}
          Facebook:
          {user.externalAccounts?.facebook?.userId ? (
            <Text>Connected</Text>
          ) : (
              <FacebookAuthButton
                label="Facebook"
                full
                onSuccess={async (accessToken) => {
                  dispatch(
                    connectExternalAccountEffect({
                      vendor: 'facebook',
                      accessToken,
                    }),
                  );
                }}
              />
            )}
        </div>
      </>
    )}>
    </AuthenticatedPage>
  );
};

const useStyles = createUseStyles({
  container: {},
});