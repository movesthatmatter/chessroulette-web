import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import logo from 'src/assets/logo.svg';

type Props = {};

export const Page: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <div className={cls.paddingWrapper}>
        <div className={cls.top}>
          <img src={logo} alt="logo" className={cls.logo} />
          <menu>
            <button>Play A Friend</button>
          </menu>
        </div>
        <main className={cls.main}>
          {props.children}
        </main>
      </div>
    </div>
  );
};

const topHeightPx = 40;

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',
    background: '#F1F1F1',
    // flex: 1,
  },
  paddingWrapper: {
    padding: '4px 16px',
    height: 'calc(100% - 32px)',
    // height: '100%',
  },
  top: {
    paddingBottom: '0px',
    height: `${topHeightPx}px`,
  },
  logo: {
    width: '200px',
  },
  main: {
    width: '100%',
    height: `calc(100% - ${topHeightPx}px)`,
  },
});
