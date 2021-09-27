import { RegisteredUserRecord } from 'dstnd-io';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { connectExternalAccountEffect } from 'src/services/Authentication';
import { CustomTheme, effects } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { LichessAuthButton } from 'src/vendors/lichess';
import { TwitchAuthButton } from 'src/vendors/twitch/TwitchAuthButton/TwitchAuthButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

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
          <div className={cls.connectedContainer}>
            <Text size="body2" style={{ marginRight: spacers.small }}>
              Connected
            </Text>
            <FontAwesomeIcon icon={faCheck} style={{ alignSelf: 'center' }} />
          </div>
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
        <Text>Twitch</Text>
        <div style={{ flex: 1 }} />
        {user.externalAccounts?.twitch?.userId ? (
          <div className={cls.connectedContainer}>
            <Text size="body2" style={{ marginRight: spacers.small }}>
              Connected
            </Text>
            <FontAwesomeIcon icon={faCheck} style={{ alignSelf: 'center' }} />
          </div>
        ) : (
          <TwitchAuthButton
            size="medium"
            type="primary"
            label="Connect Twitch"
            style={{ backgroundColor: '#6441a5', marginBottom: 0 }}
            onSuccess={async (accessToken) => {
              dispatch(
                connectExternalAccountEffect({
                  vendor: 'twitch',
                  accessToken,
                })
              );
            }}
          />
        )}
      </div>
      {/* <div className={cls.item}>
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
      </div> */}
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  container: {},
  item: {
    paddingBottom: spacers.large,
    paddingTop: spacers.large,
    borderBottom: `1px solid ${theme.colors.neutralDark}`,
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
  },
  connectedContainer: {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid #52575c47',
    padding: '5px 15px',
    ...effects.borderRadius,
  },
}));
