import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import logo from 'src/assets/logo_v2.svg';
import { UserMenu } from '../Navigation';

type Props = {};

export const Page: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <div className={cls.paddingWrapper}>
        <div className={cls.top}>
          <div className={cls.topMain}>
            <a href="/">
              <img src={logo} alt="logo" className={cls.logo} />
            </a>
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
  },
  topRight: {
    justifySelf: 'flex-end',
  },
  logo: {
    width: '200px',
  },
  main: {
    width: '100%',
    height: `calc(100% - ${topHeightPx}px)`,
  },
  userMenuWrapper: {
    // width: '250px',
  },
});
