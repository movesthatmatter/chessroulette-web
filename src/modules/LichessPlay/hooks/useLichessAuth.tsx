import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from 'src/components/Dialog';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { connectExternalAccountEffect, selectAuthentication } from 'src/services/Authentication';
import { AuthenticationDialog } from 'src/services/Authentication/widgets';
import { fonts } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { LichessAuthButton } from 'src/vendors/lichess';

export const useLichessAuth = () => {
  const auth = useSelector(selectAuthentication);
  const dispatch = useDispatch();
  const [isLichessAuthenticated, setIsLichessAuthenticated] = useState(() => {
    return auth.authenticationType === 'user' && !!auth.user.externalAccounts?.lichess?.userId;
  });
  const [lichessAuthDialog, setLichessAuthDialog] = useState<React.ReactNode>(null);

  useEffect(() => {
    setIsLichessAuthenticated(() => {
      return auth.authenticationType === 'user' && !!auth.user.externalAccounts?.lichess?.userId;
    });
    if (auth.authenticationType === 'user') {
      setLichessAuthDialog(null);
    }
  }, [auth]);

  const initLichessAuthentication = () => {
    setLichessAuthDialog(() => {
      if (auth.authenticationType === 'user') {
        return (
          <Dialog
            visible
            title={
              auth.authenticationType === 'user'
                ? 'Connect your Lichess account'
                : 'Register or Login using your Lichess Account'
            }
            onClose={() => setLichessAuthDialog(null)}
            graphic={
              <div
                style={{
                  width: '50%',
                  maxWidth: '300px',
                  margin: '0 auto',
                }}
              >
                <Mutunachi mid="1" style={{ height: '100%' }} />
              </div>
            }
            content={
              <div>
                {auth.authenticationType === 'user' ? (
                  <div style={{ textAlign: 'center', padding: spacers.default, ...fonts.body1 }}>
                    It appears you don't have a Lichess account connected.
                    <br />
                    Connect your lichess account to play open challenge games.
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: spacers.default, ...fonts.body1 }}>
                    Login or register and connect your Lichess account to be able to play open
                    challenge games.
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: spacers.defaultPx,
                  }}
                >
                  <LichessAuthButton
                    label="Connect Lichess"
                    size="medium"
                    type="secondary"
                    style={{ marginBottom: 0 }}
                    onSuccess={async (accessToken) => {
                      dispatch(
                        connectExternalAccountEffect({
                          vendor: 'lichess',
                          accessToken,
                        })
                      );
                    }}
                  />
                </div>
              </div>
            }
          />
        );
      } else if (auth.authenticationType === 'guest' || auth.authenticationType === 'none') {
        return (
          <AuthenticationDialog
            visible
            lichessAuth
            onClose={() => {
              setLichessAuthDialog(null);
            }}
          />
        );
      }
    });
  };

  return {
    isLichessAuthenticated,
    initLichessAuthentication,
    LichessAuthDialog: lichessAuthDialog,
  };
};
