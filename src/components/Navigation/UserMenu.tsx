import React, { useRef, useState } from 'react';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { selectAuthentication } from 'src/services/Authentication';
import { colors, floatingShadow, fonts, hardBorderRadius, text } from 'src/theme';
import { Avatar } from 'src/components/Avatar';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { PeerState, usePeerState } from 'src/providers/PeerProvider';
import { useOnClickOutside } from 'src/lib/hooks/useOnClickOutside';
import { Link } from 'react-router-dom';

type Props = {
  darkMode?: boolean;
  reversed?: boolean;
  withDropMenu?: boolean;
  linksTarget?: 'blank' | 'self';
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

export const UserMenu: React.FC<Props> = ({
  darkMode = false,
  reversed = false,
  withDropMenu = false,
  linksTarget = 'self',
}) => {
  const cls = useStyles();
  const auth = useSelector(selectAuthentication);
  const peerState = usePeerState();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpened, setMenuOpened] = useState(false);

  useOnClickOutside(menuRef, () => {
    setMenuOpened(false);
  });

  // TODO: Maybe change in the future
  if (auth.authenticationType === 'none') {
    return null;
  }

  const labelContent = (
    <Box fill className={cx(cls.container, darkMode && cls.containerDarkMode)} direction="row">
      <Box
        fill
        direction={reversed ? 'row-reverse' : 'row'}
        className={cls.label}
        {...(withDropMenu && {
          onClick: () => {
            setMenuOpened((prev) => !prev);
          },
        })}
      >
        <Avatar
          className={cls.avatar}
          darkMode={darkMode}
          hasBorder={darkMode}
          mutunachiId={Number(auth.user.avatarId)}
        />
        <div className={cls.spacer} />
        <Box
          direction="column"
          style={{
            textAlign: reversed ? 'right' : 'left',
          }}
        >
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
            {peerState.status === 'open' &&
              peerState.hasJoinedRoom &&
              `| ${peerState.room.name} Room `}
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

  if (withDropMenu && auth.authenticationType === 'user') {
    return (
      <div className={cx(menuOpened && cls.menuWrapper)}>
        {labelContent}
        {menuOpened && (
          <div className={cls.menuContentWrapper} ref={menuRef}>
            <div className={cls.openedMenuLabelWrapper}>{labelContent}</div>
            <div className={cls.menuContent}>
              <div className={cls.linkWrapper}>
                <Link
                  to="/user/profile"
                  className={cls.link}
                  {...(linksTarget === 'blank' && { target: '_blank' })}
                >
                  My Profile
                </Link>
              </div>
              <div className={cls.linkWrapper}>
                <Link
                  to="/user/games"
                  className={cls.link}
                  {...(linksTarget === 'blank' && { target: '_blank' })}
                >
                  My Games
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return labelContent;
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

  menuWrapper: {
    position: 'relative',
  },
  menuContentWrapper: {
    position: 'absolute',
    top: '-12px',
    paddingTop: '12px',
    right: '-12px',
    paddingRight: '12px',
    paddingLeft: '12px',

    width: '200px',

    zIndex: 999,
    background: colors.white,
    ...floatingShadow,
    ...hardBorderRadius,
  },
  openedMenuLabelWrapper: {
    paddingBottom: '16px',
    borderBottom: `1px solid ${colors.neutralLighter}`,
  },
  menuContent: {
    paddingTop: '16px',
  },
  label: {
    '&:focus': {
      ...makeImportant({
        boxShadow: 'none',
      }),
    },
  },

  linkWrapper: {
    padding: '8px 20px 16px',
    alignSelf: 'center',
    textAlign: 'right',
  },
  link: {
    textTransform: 'capitalize',
    textDecoration: 'none',
    color: colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
    fontSize: '16px',
    textAlign: 'right',

    '&:hover': {
      borderBottom: `3px solid ${text.primaryColor}`,
      color: text.primaryColor,
    },
  },
});
