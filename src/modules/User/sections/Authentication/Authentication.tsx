import { RegisteredUserRecord } from 'dstnd-io';
import React from 'react';
import { useDispatch } from 'react-redux';
import { createUseStyles } from 'src/lib/jss';
import { connectExternalAccountEffect } from 'src/services/Authentication';
import { borderRadius, colors, floatingShadow } from 'src/theme';
import { FacebookAuthButton } from 'src/vendors/facebook';
import { LichessAuthButton } from 'src/vendors/lichess';

type Props = {
  user: RegisteredUserRecord;
};

export const Authentication: React.FC<Props> = ({ user }) => {
  const cls = useStyles();
  const dispatch = useDispatch();

  return (
    <div className={cls.container}>
      <div style={{ paddingTop: 30 }}>
        <div style={{ width: '270px', marginBottom: '30px' }}>Connected Accounts:</div>
        {user.externalAccounts?.lichess?.userId ? (
          <div className={cls.lichessConnected}>Lichess</div>
        ) : (
          <LichessAuthButton
            full
            label="Connect Lichess"
            type="secondary"
            onSuccess={async (accessToken) => {
              dispatch(
                connectExternalAccountEffect({
                  vendor: 'lichess',
                  accessToken,
                })
              );
            }}
          />
        )}
        {user.externalAccounts?.facebook?.userId ? (
          <div className={cls.facebookConnected}>Facebook</div>
        ) : (
          <FacebookAuthButton
            label="Connect Facebook"
            full
            onSuccess={async (accessToken) => {
              dispatch(
                connectExternalAccountEffect({
                  vendor: 'facebook',
                  accessToken,
                })
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  lichessConnected: {
    backgroundColor: colors.secondary,
    padding: '8px',
    ...borderRadius,
    ...floatingShadow,
    color: colors.neutralDarkest,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  facebookConnected: {
    backgroundColor: colors.primary,
    padding: '8px',
    ...borderRadius,
    ...floatingShadow,
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
