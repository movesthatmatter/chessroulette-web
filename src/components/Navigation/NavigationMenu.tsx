import React, { useState } from 'react';
import cx from 'classnames';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import { hideOnDesktop, hideOnMobile, floatingShadow } from 'src/theme';
import { Menu } from 'grommet-icons';
import { FormClose } from 'grommet-icons';
import { UserMenu } from './UserMenu';
import { useAuthentication } from 'src/services/Authentication';
import { AuthenticationButton } from 'src/services/Authentication/widgets';
import { Link, useLocation } from 'react-router-dom';
import { DarkModeSwitch } from '../DarkModeSwitch/DarkModeSwitch';
import { Home, Video, People, Category } from 'react-iconly';
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
          <br />
          <Text size="small1">Home</Text>
        </Link>
        {/* <Badge
          color="negative"
          text="New"
          className={cls.linkBadge}
          textClassName={cls.linkBadgeText}
        /> */}
      </div>
      <div className={cls.linkWrapper}>
        <Link
          to={'/events/wcc-2021'}
          className={cx(cls.link, location.pathname.indexOf('/events') > -1 && cls.activeLink)}
        >
          {/* <Category set='bold' /> */}
          <FontAwesomeIcon
            icon={faTrophy}
            size="lg"
            style={{ marginBottom: '5px', marginTop: '2px' }}
          />
          <br />
          <Text size="small1">Events</Text>
        </Link>
      </div>

      {/* <div className={cls.linkWrapper}>
        <a
          className={cls.link}
          href="https://gabrielctroia.medium.com/meet-chessroulette-org-a-quarantine-project-e4108f05db39"
          target="_blank"
        >
          About
        </a>
      </div>
      <div className={cls.linkWrapper}>
        <a
          className={cls.link}
          href="mailto:hi@chessroulette.org?subject=Hi from Chessroulette's Homepage"
        >
          Get In Touch
        </a>
      </div> */}
      {/* <div className={cls.linkWrapper}>
        <WithDialog
          hasCloseButton
          buttons={
            [
              // () => (
            ]
          }
          title="Let's Play"
          contentContainerClass={cls.playDialogContent}
          graphic={
            <div className={cls.mutunachiContainer}>
              <Mutunachi mid="10" />
            </div>
          }
          content={(r) => (
            <>
              <CreateRoomButtonWidget
                label="Play"
                type="primary"
                createRoomSpecs={{
                  type: 'private',
                  activityType: 'play',
                }}
                full
                style={{
                  marginBottom: spacers.default,
                }}
                // onClick={r.onClose}
              />
              <CreateRoomButtonWidget
                label="Analyze"
                type="secondary"
                style={{
                  marginBottom: 0,
                }}
                full
                createRoomSpecs={{
                  type: 'private',
                  activityType: 'analysis',
                }}
                // onClick={r.onClose}
              />
            </>
          )}
          render={(r) => (
            <a
              className={cls.link}
              href="#"
              onClick={(e) => {
                e.preventDefault();

                r.onOpen();
              }}
            >
              <Game set="bold" />
              <br />
              <Text size="small1">Play</Text>
            </a>
          )}
        />
      </div> */}
      <div className={cls.linkWrapper}>
        <Link
          to={'/watch'}
          className={cx(cls.link, location.pathname === '/watch' && cls.activeLink)}
        >
          <Video set="bold" />
          <br />
          <Text size="small1">Watch</Text>
        </Link>
      </div>
      <div className={cls.linkWrapper}>
        <a className={cls.link} href="https://partner.chessroulette.live" target="_blank">
          <People set="bold" />
          <br />
          <Text size="small1">Collaborate</Text>
        </a>
      </div>
    </>
  );

  return (
    <div className={cx(cls.containerMenu, props.className)}>
      <div className={cls.desktopMenu}>
        <div className={cx(cls.linksContainer)}>{menuContent}</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        <div
          style={{
            marginRight: '20px',
            justifyContent: 'center',
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
          }}
        >
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
    // justifyContent: 'center',
    flex: 1,
    // background: 'red'
  },
  linkWrapper: {
    textAlign: 'center',
    paddingLeft: spacers.default,
    paddingRight: spacers.default,
    alignSelf: 'center',
    position: 'relative',

    width: '60px',
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

    '&:hover': {
      ...theme.links.hover,
    },
  },
  activeLink: {
    // borderBottom: `3px solid ${theme.text.primaryColor}`,
    // color: theme.text.primaryColor,
    ...theme.links.hover,
    //borderBottom: `3px solid ${theme.text.primaryColor}`,
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
}));
