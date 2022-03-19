import React, { useState } from 'react';
import cx from 'classnames';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import {
  hideOnDesktop,
  hideOnMobile,
  floatingShadow,
  onlyMobile,
  onlyDesktop,
  fonts,
} from 'src/theme';
import { Menu } from 'grommet-icons';
import { FormClose } from 'grommet-icons';
import { UserMenu } from './UserMenu';
import { useAuthentication } from 'src/services/Authentication';
import { AuthenticationButton } from 'src/services/Authentication/widgets';
import { Link, useLocation } from 'react-router-dom';
import { DarkModeSwitch } from '../DarkModeSwitch/DarkModeSwitch';
import { Home, Video, People, Game } from 'react-iconly';
import { Text } from '../Text';
import { spacers } from 'src/theme/spacers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

type Props = {
  className?: string;
};

export const NavigationMenu: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [open, setOpen] = useState(false);
  const auth = useAuthentication();
  const location = useLocation();

  const menuContent = (
    <>
      <div className={cls.linkWrapper}>
        <Link to={'/'} className={cx(cls.link, location.pathname === '/' && cls.activeLink)}>
          <Home set="bold" />
          <Text size="small1">Home</Text>
        </Link>
      </div>
      <div className={cls.linkWrapper}>
        <Link
          to={'/watch'}
          className={cx(cls.link, location.pathname === '/watch' && cls.activeLink)}
        >
          <Video set="bold" />
          <Text size="small1">Watch</Text>
        </Link>
      </div>
      <div className={cls.linkWrapper}>
        <a className={cls.link} href="https://partner.chessroulette.live" target="_blank">
          <People set="bold" />
          <Text size="small1">Collaborate</Text>
        </a>
      </div>
      {/* <div className={cls.linkWrapper}>
        <Link
          to={'/tournaments'}
          className={cx(cls.link, location.pathname.indexOf('/tournaments') > -1 && cls.activeLink)}
        >
          <FontAwesomeIcon icon={faTrophy} className={cls.tournamentsIcon} />
          <Text size="small1">Tournaments</Text>
        </Link>
      </div> */}
    </>
  );

  return (
    <div className={cx(cls.containerMenu, props.className)}>
      <div className={cls.desktopMenu}>
        <div className={cx(cls.linksContainer)}>{menuContent}</div>
        <div className={cls.darkModeSwitchDesktopContainer}>
          <DarkModeSwitch />
        </div>
        {auth.authenticationType !== 'none' && (
          <div className={cls.authMenu}>
            {auth.authenticationType === 'user' ? (
              <UserMenu withDropMenu />
            ) : (
              <AuthenticationButton />
            )}
          </div>
        )}
      </div>
      <div className={cx(cls.onlyMobile)}>
        <div className={cls.darkModeSwitchMobileContainer}>
          <DarkModeSwitch />
        </div>
        <div className={cls.menuWrapper} onClick={() => setOpen((prev) => !prev)}>
          <Menu className={cls.drawerOpenBtn} />
        </div>
        <div className={cx(cls.mobileOverlay, open && cls.mobileOverlayOpened)}>
          <div
            className={cx(cls.overlayBkg, open && cls.overlayBkgOpened)}
            onClick={() => setOpen(false)}
          />
          <div className={cx(cls.drawer, open && cls.drawerOpened)}>
            <div className={cx(cls.drawerMenuContainer)}>
              <FormClose onClick={() => setOpen(false)} className={cls.drawerCloseBtn} />
              <div className={cls.drawerMenuContent}>
                <div className={cls.drawerUserMenuWrapper}>
                  {auth.authenticationType === 'user' ? (
                    <UserMenu reversed withDropMenu />
                  ) : (
                    <AuthenticationButton
                      containerClassName={cls.mobileAuthenticationButton}
                      onClick={() => setOpen(false)}
                    />
                  )}
                </div>
                <div className={cls.drawerLinksContainer}>{menuContent}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  containerMenu: {},
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,

    transform: 'translateX(-100%)',
    overflow: 'hidden',

    zIndex: 999,
  },
  mobileOverlayOpened: {
    transform: 'translateX(0)',
    opacity: 1,
  },
  overlayBkg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, .5)',
    zIndex: 991,
    opacity: 0,
    transition: '50ms opacity ease-in',
  },
  overlayBkgOpened: {
    opacity: 1,
  },

  drawer: {
    height: '100%',
    width: '75%',
    marginLeft: '25%',
    ...floatingShadow,
    borderTopLeftRadius: '16px',
    borderBottomLeftRadius: '16px',
    overflow: 'hidden',

    position: 'relative',
    zIndex: 992,
    transform: 'translateX(50%)',
    transition: '70ms ease-in-out',
  },
  drawerOpened: {
    transform: 'translateX(0%)',
  },
  drawerOpenBtn: {
    cursor: 'pointer',
  },
  drawerCloseBtn: {
    cursor: 'pointer',
    position: 'absolute',
    top: '16px',
    left: '16px',
    fill: `${theme.colors.neutral} !important`,
    stroke: `${theme.colors.neutral} !important`,
  },

  drawerMenuContainer: {
    background: theme.colors.white,
    padding: '0 24px',
    height: '100%',

    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },

  drawerUserMenuWrapper: {
    padding: '32px 0',
    borderBottom: `1px solid ${
      theme.name === 'lightDefault' ? theme.colors.neutralLighter : theme.colors.neutralDark
    }`,
  },
  drawerMenuContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    ...({
      '& $linkWrapper': {
        padding: '16px 0',
        textAlign: 'right',
      },
    } as CSSProperties),
  },
  drawerLinksContainer: {
    paddingTop: '16px',
    flex: 1,
  },

  linksContainer: {
    display: 'flex',
    flex: 1,
  },
  linkWrapper: {
    textAlign: 'center',
    paddingLeft: spacers.large,
    paddingRight: spacers.large,
    alignSelf: 'center',
    position: 'relative',

    ...onlyDesktop({
      // width: '60px',
    }),
  },
  linkBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-5px',
  },
  linkBadgeText: {
    fontSize: '10px',
    lineHeight: '13px',
    ...makeImportant({
      boxShadow: 'none',
    }),
  },
  link: {
    textTransform: 'capitalize',
    textDecoration: 'none',
    color: theme.colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
    fontSize: '16px',
    textAlign: 'center',

    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',

    ...onlyMobile({
      flexDirection: 'row-reverse',
      ...({
        '& > span': {
          marginRight: spacers.small,
          ...fonts.body1,
        },
      } as CSSProperties['nestedKey']),
    }),

    '&:hover': {
      ...theme.links.hover,
    },
  },
  activeLink: {
    ...theme.links.hover,
    color: theme.colors.primary,
  },

  onlyMobile: {
    ...hideOnDesktop,
    justifyContent: 'flex-end',
    display: 'flex',
    justifyItems: 'flex-end',
  },
  desktopMenu: {
    ...hideOnMobile,
    display: 'flex',
    flexDirection: 'row',
  },
  authMenu: {
    minWidth: '180px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  mobileAuthenticationButton: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  menuWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  newBadge: {
    position: 'absolute',
    zIndex: 1,
    transform: 'scale(.9) translate(-20px, -5px)',
  },

  playDialogContent: {
    paddingBottom: 0,
  },

  mutunachiContainer: {
    width: '50%',
    maxWidth: '300px',
    margin: '0 auto',
    marginBottom: spacers.large,
  },
  mutunachi: {
    height: '100%',
  },

  darkModeSwitchDesktopContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkModeSwitchMobileContainer: {
    marginRight: spacers.default,
    justifyContent: 'center',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
  },

  tournamentsIcon: {
    fontSize: '16px',
    marginTop: '5px',
    marginBottom: '3px',
  },
}));
