import { RegisteredUserRecord } from 'dstnd-io';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { connectExternalAccountEffect } from 'src/services/Authentication';
import { colors } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { FacebookAuthButton } from 'src/vendors/facebook';
import { LichessAuthButton } from 'src/vendors/lichess';

type Props = {
  user: RegisteredUserRecord;
};

export const UserConnections: React.FC<Props> = ({ user }) => {
  const cls = useStyles();
  const dispatch = useDispatch();

  return (
    <div className={cls.container}>
      <div className={cls.item}>
        <Text>Lichess</Text>
        <div style={{ flex: 1 }} />
        {user.externalAccounts?.lichess?.userId ? (
          <Text size="body2">Connected</Text>
        ) : (
          <LichessAuthButton
            label="Connect Lichess"
            size="medium"
            type="primary"
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
        )}
      </div>
      <div className={cls.item}>
        <Text>Facebook</Text>
        <div style={{ flex: 1 }} />
        {user.externalAccounts?.facebook?.userId ? (
          <Text size="body2">Connected</Text>
        ) : (
          <FacebookAuthButton
            label="Connect Facebook"
            size="medium"
            style={{ marginBottom: 0 }}
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
  item: {
    paddingBottom: spacers.large,
    paddingTop: spacers.large,
    borderBottom: `1px solid ${colors.neutralDark}`,
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
  },
});
