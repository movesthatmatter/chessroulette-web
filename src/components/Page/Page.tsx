import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Logo } from 'src/components/Logo';
import { Footer } from '../Footer';
import { NavigationMenu } from '../Navigation/NavigationMenu';
import { colors, fonts, text } from 'src/theme';

export type PageProps = {
  logoAsLink?: boolean;
  title?: string;
};

export const Page: React.FC<PageProps> = ({ logoAsLink = true, ...props }) => {
  const cls = useStyles();

  return (
    <div className={cls.root}>
      <div className={cls.container}>
        <div className={cls.content}>
          <div className={cls.top}>
            <div className={cls.topMain}>
              <Logo asLink={logoAsLink} />
              <div className={cls.navigationMenu}>
                <NavigationMenu />
              </div>
            </div>
          </div>
          <main className={cls.main}>
            {props.title && <h1 className={cls.title}>{props.title}</h1>}
            {props.children}
          </main>
        </div>
      </div>
      <div className={cls.footer}>
        <Footer />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flex: '1 0',
    background: colors.neutralLightest,
  },
  footer: {
    flexShrink: 0,
  },
  content: {
    flex: 1,
    height: '100%',
    maxWidth: '1140px',
    margin: '0 auto',
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
    padding: '16px',
  },
  topRight: {
    justifySelf: 'flex-end',
  },
  main: {
    padding: '16px',
    paddingBottom: '60px',
    width: 'calc(100% - 32px)',
    height: 'calc(100% - 92px)',
  },
  navigationMenu: {
    alignSelf: 'center',
    justifySelf: 'center',
    flex: 1,
  },
  title: {
    color: text.baseColor,
    ...fonts.title1,
  },
});
