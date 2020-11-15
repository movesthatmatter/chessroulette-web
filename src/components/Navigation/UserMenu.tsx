import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { selectAuthentication } from 'src/services/Authentication';
import { colors, floatingShadow, fonts } from 'src/theme';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { Avatar } from 'src/components/Avatar';
import { useSelector } from 'react-redux';
import { selectMyPeer } from '../PeerProvider';
import { Peer } from '../RoomProvider';

type Props = {};

const getStatusColor = (peer?: Peer) => {
  if (!peer) {
    return colors.neutral;
  }

  if (peer.connection.channels.streaming.on) {
    return colors.primary;
  }

  return colors.positive;
}

export const UserMenu: React.FC<Props> = () => {
  const cls = useStyles();
  const auth = useSelector(selectAuthentication);
  const myPeer = useSelector(selectMyPeer);

  // TODO: Maybe change in the future
  if (auth.authenticationType === 'none') {
    return null;
  }

  return (
    <Box fill className={cls.container} direction="row">
      <Box fill direction="row">
        <Avatar className={cls.avatar}>
          <Mutunachi mid={auth.user.avatarId} />
        </Avatar>
        <Box direction="column">
          <Text className={cls.userNameText}>{auth.user.name}</Text>
          <Text className={cls.userType}>
            {auth.user.isGuest ? 'Guest' : ''}
            <div
              className={cls.dot}
              style={{
                backgroundColor: getStatusColor(myPeer),
              }}
            />
          </Text>
        </Box>
      </Box>
    </Box>
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
  },
  dot: {
    height: '8px',
    width: '8px',
    backgroundColor: colors.neutral,
    borderRadius: '50%',
    display: 'inline-block',
    marginLeft: '4px',
  },
  userNameWrapper: {},
});
