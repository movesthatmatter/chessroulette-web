import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import logo from 'src/assets/logo_v2.svg';

type Props = {};

export const NavigationHeader: React.FC<Props> = () => {
  const cls = useStyles();

  return (
    <div className={cls.top}>
      <div className={cls.topMain}>
        <a href="/">
          <img src={logo} alt="logo" className={cls.logo} />
        </a>
      </div>
    </div>
  );
};

const topHeightPx = 60;

const useStyles = createUseStyles({
  container: {},
  top: {
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
});
