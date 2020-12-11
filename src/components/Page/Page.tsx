import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { UserMenu } from '../Navigation';
import { colors, hideOnDesktop, hideOnMobile, text } from 'src/theme';
import { Logo } from 'src/components/Logo';
import cx from 'classnames';
import { Footer } from '../Footer';
import { Helmet } from 'react-helmet';

type Props = {
  logoAsLink?: boolean;
};

export const Page: React.FC<Props> = ({ logoAsLink = true, ...props }) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <Helmet bodyAttributes={{ class: cls.body }}>
        {/* <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/> */}
      </Helmet>
      <div className={cls.paddingWrapper}>
        <div className={cls.top}>
          <div className={cls.topMain}>
            <Logo asLink={logoAsLink} />
            <div className={cx(cls.nav, cls.desktopOnly)}>
              <div className={cls.linksContainer}>
                <div className={cls.linkWrapper}>
                  <a
                    className={cls.link}
                    href="https://www.facebook.com/chessroulette"
                    target="_blank"
                  >
                    About
                  </a>
                </div>
                <div className={cls.linkWrapper}>
                  <a
                    className={cls.link}
                    href="https://www.instagram.com/chessroulette/"
                    target="_blank"
                  >
                    Instagram
                  </a>
                </div>
                <div className={cls.linkWrapper}>
                  <a
                    className={cls.link}
                    href="mailto:hi@chessroulette.org?subject=Hi from Chessroulette's Homepage"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={cx(cls.userMenuWrapper)}>
            <UserMenu reversed />
          </div>
        </div>
        <main className={cls.main}>{props.children}</main>
        <Footer />
        <div />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  body: {
    background: colors.lightBackground,
    // paddingTop: 'env(safe-area-inset-top, 16px)',
    // paddingLeft: 'env(safe-area-inset-left, 16px)',
    // paddingRight: 'env(safe-area-inset-right, 16px)',
    // paddingBottom: 'env(safe-area-inset-bottom, 16px)',
    // height: 'calc(100vh - (env(safe-area-inset-top, 16px) + env(safe-area-inset-bottom, 16px)))',
    height: '100%',
    width: '100%',
    // flex: 1,
  },
  container: {
    width: '100%',
    height: '100%',
    // display: 'flex',
  },
  paddingWrapper: {
    paddingLeft: '16px',
    paddingRight: '16px',
    // padding: '16px',
    flex: 1,

    // paddingBottom: 'env(safe-area-inset-bottom, 16px)',
    // height: 'calc(100% - 32px)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  topMain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  topRight: {
    justifySelf: 'flex-end',
  },
  main: {
    width: '100%',
    // flex: 1,
  },
  userMenuWrapper: {},
  nav: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
  },
  linksContainer: {
    paddingTop: '14px',
    display: 'flex',
  },
  linkWrapper: {
    textAlign: 'center',
    paddingLeft: '20px',
    paddingRight: '20px',
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

  mobileOnly: {
    ...hideOnDesktop,
  },
  desktopOnly: {
    ...hideOnMobile,
  },
});
