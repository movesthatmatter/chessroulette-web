import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { UserMenu } from '../Navigation';
import { colors, text } from 'src/theme';
import { Logo } from 'src/components/Logo';

type Props = {
  logoAsLink?: boolean;
};

export const Page: React.FC<Props> = ({
  logoAsLink = true,
  ...props
}) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <div className={cls.paddingWrapper}>
        <div className={cls.top}>
          <div className={cls.topMain}>
            <Logo asLink={logoAsLink}/>
            <div className={cls.nav}>
              <div className={cls.linksContainer}>
                <div className={cls.linkWrapper}>
                  <a className={cls.link} href="mailto:support@chessroulette.org">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={cls.userMenuWrapper}>
            <UserMenu />
          </div>
        </div>
        <main className={cls.main}>{props.children}</main>
      </div>
    </div>
  );
};

const topHeightPx = 60;

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',
    background: '#F6F8FB',
  },
  paddingWrapper: {
    padding: '4px 16px',
    height: 'calc(100% - 32px)',
  },
  top: {
    paddingTop: '10px',
    paddingBottom: '10px',
    height: `${topHeightPx}px`,
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
    height: `calc(100% - ${topHeightPx}px)`,
  },
  userMenuWrapper: {
    width: '250px',
  },
  nav: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'flex-end',
  },
  linksContainer: {
    paddingTop: '5px',
    paddingRight: '32px',
    display: 'flex',
  },
  linkWrapper: {
    textAlign: 'center',
  },
  link: {
    paddingLeft: '20px',
    paddingRight: '20px',
    textTransform: 'capitalize',
    textDecoration: 'none',
    color: colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
    fontSize: '16px',
    textAlign: 'center',

    '&:hover': {
      fontWeight: 600,
      color: text.primaryColor,
    },
  },
});
