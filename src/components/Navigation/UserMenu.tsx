import React, { useRef, useState } from 'react';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { selectAuthentication } from 'src/services/Authentication';
import { colors, floatingShadow, fonts, hardBorderRadius, text } from 'src/theme';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { Avatar } from 'src/components/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { PeerState, usePeerState } from 'src/providers/PeerProvider';
import { LogoutButton } from 'src/services/Authentication/widgets';
import { useOnClickOutside } from 'src/lib/hooks/useOnClickOutside';
import { NavLink, useLocation } from 'react-router-dom';

type Props = {
  darkMode?: boolean;
  reversed?: boolean;
  withDropMenu?: boolean;
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
}) => {
  const cls = useStyles();
  const auth = useSelector(selectAuthentication);
  const peerState = usePeerState();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpened, setMenuOpened] = useState(false);
  const [profileOver, setProfileOver] = useState(false);
  const [gamesOver, setGamesOver] = useState(false);
  const [signOutOver, setSignOutOver] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

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
        <Avatar className={cls.avatar} darkMode={darkMode} hasBorder={darkMode}>
          <Mutunachi mid={auth.user.avatarId} />
        </Avatar>
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

  if (withDropMenu) {
    return (
      <div className={cx(menuOpened && cls.menuWrapper)}>
        {labelContent}
        {menuOpened && (
          <div className={cls.menuContentWrapper} ref={menuRef}>
            <div className={cls.openedMenuLabelWrapper}>{labelContent}</div>
            <div className={cls.menuContent}>
              <div className={cls.linkWrapper}>
                <div
                  className={cls.largeDot}
                  style={{
                    width: profileOver || location.pathname === '/user' ? '100%' : '18px',
                    transition: 'width 0.5s ease-in-out',
                  }}
                />
                <NavLink
                  to="/user"
                  className={cls.link}
                  onMouseOver={() => setProfileOver(true)}
                  onMouseOut={() => setProfileOver(false)}
                  onFocus={() => setProfileOver(true)}
                  onBlur={() => setProfileOver(false)}
                  activeStyle={{ color: colors.white }}
                  exact
                >
                  My Profile
                </NavLink>
              </div>
              <div className={cls.linkWrapper}>
                <div
                  className={cls.largeDot}
                  style={{
                    width: gamesOver || location.pathname === '/user/games' ? '100%' : '18px',
                    transition: 'width 0.5s ease-in-out',
                  }}
                />
                <NavLink
                  to="/user/games"
                  className={cls.link}
                  onMouseOver={() => setGamesOver(true)}
                  onMouseOut={() => setGamesOver(false)}
                  onFocus={() => setGamesOver(true)}
                  onBlur={() => setGamesOver(false)}
                  activeStyle={{ color: colors.white }}
                  exact
                >
                  My Games
                </NavLink>
              </div>
              <div className={cls.linkWrapper}>
                <div
                  className={cls.largeDot}
                  style={{
                    width: signOutOver ? '100%' : '18px',
                    transition: 'width 0.5s ease-in-out',
                  }}
                />
                <div
                  onClick={() => {}}
                  className={cls.link}
                  onMouseOver={() => setSignOutOver(true)}
                  onMouseOut={() => setSignOutOver(false)}
                  onFocus={() => setSignOutOver(true)}
                  onBlur={() => setSignOutOver(false)}
                >
                  Sign Out
                </div>
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
  largeDot: {
    height: '18px',
    width: '18px',
    backgroundColor: colors.primary,
    borderRadius: '16px',
    marginLeft: '46%',
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
    padding: '6px 0px 16px',
    alignSelf: 'center',
    textAlign: 'right',
    position: 'relative',
    display: 'flex',
  },
  link: {
    textTransform: 'capitalize',
    textDecoration: 'none',
    color: colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
    fontSize: '15px',
    textAlign: 'right',
    position: 'absolute',
    top: '5px',
    right: '10px',
    marginLeft: '10px',
    '&:hover': {
      // borderBottom: `3px solid ${text.primaryColor}`,
      cursor: 'pointer',
      color: colors.white,
    },
  },
});
