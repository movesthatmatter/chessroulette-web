import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { selectAuthentication } from 'src/services/Authentication';
import { colors, floatingShadow, fonts } from 'src/theme';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { Avatar } from 'src/components/Avatar';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { PeerState, usePeerState } from 'src/providers/PeerProvider';
import { LogoutButton } from 'src/services/Authentication/widgets';


type Props = {
  darkMode?: boolean;
  reversed?: boolean;
};

const getStatusColor = (peerState: PeerState) => {
  if (peerState.status !== 'open') {
    return colors.neutral;
  }

  if (peerState.hasJoinedRoom && peerState.connected) {
    return colors.primary;
  }

  return colors.positive;
};

export const UserMenu: React.FC<Props> = ({ darkMode = false, reversed = false }) => {
  const cls = useStyles();
  const auth = useSelector(selectAuthentication);
  const peerState = usePeerState();

  // TODO: Maybe change in the future
  if (auth.authenticationType === 'none') {
    return null;
  }

  return (
    <Box
      fill
      className={cx(cls.container, darkMode && cls.containerDarkMode)}
      direction="row"
    >
      <Box fill direction={reversed ? 'row-reverse' : 'row'} align="center">
        {/* <Menu size="medium" color={darkMode ? colors.white : colors.neutralDark} /> */}
        {/* <FontAwesomeIcon
          icon={faEllipsisV}
          color={darkMode ? colors.white : colors.neutralDark}
          // size="sm"
          // className={cls.exitIcon}
          // onClick={() => props.onClose()}
        />
        <div className={cls.spacer} /> */}
        <Avatar className={cls.avatar} darkMode={darkMode} hasBorder={darkMode}>
          <Mutunachi mid={auth.user.avatarId} />
        </Avatar>
        <div className={cls.spacer} />
        <Box direction="column" style={{
          textAlign: reversed ? 'right' : 'left',
        }}>
          <Text className={cls.userNameText} size="small2">
            {auth.user.name}
          </Text>
          <Text className={cls.userType}>
            <div
              className={cls.dot}
              style={{
                backgroundColor: getStatusColor(peerState),
                display: reversed ? 'none' : 'inline-block',
              }}
            />
            {auth.user.isGuest ? ' Guest ' : ' User '}
            {peerState.status === 'open' && peerState.hasJoinedRoom && `| ${peerState.room.name} Room `}
            <div
              className={cls.dot}
              style={{
                backgroundColor: getStatusColor(peerState),
                display: reversed ? 'inline-block' : 'none',
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
  containerDarkMode: {
    color: colors.white,
  },
  avatar: {
    height: '32px',
    width: '32px',
    background: '#ddd',
    ...floatingShadow,
  },
  spacer: {
    width: '8px',
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
  },
  userNameWrapper: {},
});
