import React, { useState } from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { colors, text, hideOnDesktop, hideOnMobile, floatingShadow } from 'src/theme';
import { Menu } from 'grommet-icons';
import cx from 'classnames';
import { FormClose } from 'grommet-icons';
import { UserMenu } from './UserMenu';
import { useFeedbackDialog } from '../FeedbackDialog/useFeedbackDialog';
import { useAuthentication } from 'src/services/Authentication';
import { AuthenticationButton, LogoutButton } from 'src/services/Authentication/widgets';

type Props = {
  className?: string;
};

export const NavigationMenu: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [open, setOpen] = useState(false);
  const feedbackDialog = useFeedbackDialog();
  const auth = useAuthentication();

  const menuContent = (
    <>
      <div className={cls.linkWrapper}>
        <a
          className={cls.link}
          href="https://gabrielctroia.medium.com/meet-chessroulette-org-a-quarantine-project-e4108f05db39"
          target="_blank"
        >
          About
        </a>
      </div>
      <div className={cls.linkWrapper}>
        <a className={cls.link} href="https://www.instagram.com/chessroulette/" target="_blank">
          Instagram
        </a>
      </div>
      <div className={cls.linkWrapper}>
        <a
          className={cls.link}
          href="mailto:hi@chessroulette.org?subject=Hi from Chessroulette's Homepage"
        >
          Get In Touch
        </a>
      </div>
      <div className={cls.linkWrapper}>
        <a
          className={cls.link}
          href="#"
          onClick={(e) => {
            e.preventDefault();

            setOpen(false);
            feedbackDialog.forcefullyShowAllSteps()
          }}
        >
          Leave Feedback
        </a>
      </div>
    </>
  );

  return (
    <div className={cx(cls.container, props.className)}>
      <div className={cls.desktopMenu}>
        <div className={cx(cls.linksContainer)}>{menuContent}</div>
        <div className={cls.authMenu}>
          {auth.authenticationType === 'user'
            ? <UserMenu reversed withDropMenu />
            : <AuthenticationButton />
          }
        </div>
      </div>
      <div className={cx(cls.onlyMobile)}>
        <Menu className={cls.drawerOpenBtn} onClick={() => setOpen((prev) => !prev)} />
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
                  {auth.authenticationType === 'user'
                    ? <UserMenu reversed withDropMenu />
                    : <AuthenticationButton containerClassName={cls.mobileAuthenticationButton} />
                  }
                </div>
                <div className={cls.drawerLinksContainer}>{menuContent}</div>
                {auth.authenticationType === 'user' && (
                  <LogoutButton full type="secondary" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,

    transform: 'translateX(-100%)',
    overflow: 'hidden',
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
  },

  drawerMenuContainer: {
    background: colors.white,
    padding: '0 24px',
    height: '100%',

    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },

  drawerUserMenuWrapper: {
    padding: '32px 0',
    borderBottom: `1px solid ${colors.neutralLighter}`,
  },
  drawerMenuContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    // background: 'red',
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
    justifyContent: 'center',
    flex: 1,
  },
  linkWrapper: {
    textAlign: 'center',
    paddingLeft: '20px',
    paddingRight: '20px',
    alignSelf: 'center',
  },
  link: {
    textTransform: 'capitalize',
    textDecoration: 'none',
    color: colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
    fontSize: '16px',
    textAlign: 'center',

    '&:hover': {
      borderBottom: `3px solid ${text.primaryColor}`,
      color: text.primaryColor,
    },
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
  },

  mobileAuthenticationButton: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
