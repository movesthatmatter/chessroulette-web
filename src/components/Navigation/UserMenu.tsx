import { Avatar, Box, Menu, Text } from 'grommet';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { AuthenticationConsumer } from 'src/services/Authentication';
import { floatingShadow, fonts } from 'src/theme';
import { Mutunachi } from '../Mutunachi/Mutunachi';

type Props = {};

export const UserMenu: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <AuthenticationConsumer
      renderAuthenticated={(user) => (
        <Box fill className={cls.container} direction="row">
          <Box fill direction="row">
            <Avatar
              size="medium"
              round="large"
              margin={{
                right: 'small',
              }}
              className={cls.avatar}
            >
              <Mutunachi mid={user.avatarId} />
            </Avatar>
            <Box direction="column">
              <Text className={cls.userNameText}>{user.name}</Text>
              <Text className={cls.userType}>{user.isGuest ? 'Guest' : ''}</Text>
            </Box>
          </Box>
        </Box>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
  avatar: {
    height: '32px',
    width: '32px',
    background: '#ddd',
    ...floatingShadow,
  },
  userNameText: {
    ...fonts.small2,
  },
  userType: {
    ...fonts.small1,
  }
});
