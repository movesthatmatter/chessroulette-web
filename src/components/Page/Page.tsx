import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Logo } from 'src/components/Logo';
import { Footer } from '../Footer';
import { NavigationMenu } from '../Navigation/NavigationMenu';

type Props = {
  logoAsLink?: boolean;
};

export const Page: React.FC<Props> = ({ logoAsLink = true, ...props }) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <div className={cls.paddingWrapper}>
        <div className={cls.top}>
          <div className={cls.topMain}>
            <Logo asLink={logoAsLink} />
            <div className={cls.navigationMenu}>
              <NavigationMenu />
            </div>
          </div>
        </div>
        <main className={cls.main}>{props.children}</main>
        <Footer />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',
    background: '#F6F8FB',

    maxWidth: '1140px',
    margin: '0 auto',
  },
  paddingWrapper: {
    padding: '16px',
    height: 'calc(100% - 32px)',
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
    justifyContent: 'space-between',
  },
  topRight: {
    justifySelf: 'flex-end',
  },
  main: {
    width: '100%',
    flex: 1,
  },
  navigationMenu: {
    alignSelf: 'center',
    justifySelf: 'center',
    flex: 1,
  },
});
