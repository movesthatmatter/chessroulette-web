import React, { useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Logo } from 'src/components/Logo';
import { Footer } from '../Footer';
import { NavigationMenu } from '../Navigation/NavigationMenu';
import { fonts } from 'src/theme';
import { Events } from 'src/services/Analytics';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';
import { Text } from '../Text';
import { getBoxShadow } from 'src/theme/util';
import { useTheme } from 'react-jss';
import {CustomTheme} from 'src/theme';

export type PageProps = {
  // This name will be used on analytics
  // name: string;

  contentClassName?: string;
  footerClassName?: string;

  logoAsLink?: boolean;
  title?: string;
} & (
  | {
      doNotTrack: true;
      name?: string;
    }
  | {
      doNotTrack?: false;
      name: string;
    }
);

export const Page: React.FC<PageProps> = ({ logoAsLink = true, ...props }) => {
  const cls = useStyles();

  useEffect(() => {
    if (props.name) {
      Events.trackPageView(props.name);
    }
  }, [props.name]);

  return (
    <div className={cls.root}>
      <div className={cls.container}>
        <div className={`${cls.content} ${props.contentClassName}`}>
          <div className={cls.top}>
            <div className={`${cls.topMain} ${cls.responsive}`}>
              <Logo asLink={logoAsLink} withBeta />
              <div className={cls.navigationMenu}>
                <NavigationMenu />
              </div>
            </div>
          </div>
          <main className={`${cls.main} ${cls.responsive}`}>
            {props.title && <h1 className={cls.title}>{props.title}</h1>}
            {props.children}
          </main>
          <div className={cls.preFooter}>
            <div className={cx(cls.responsive, cls.centralizeContent)}>
              <Text
                size="body2"
                className={cls.text}
                style={{
                  fontWeight: 300,
                }}
              >
                Made with ❤️around the world!
              </Text>
            </div>
          </div>
        </div>
      </div>
      <div className={`${cls.footer} ${props.footerClassName}`}>
        <Footer />
      </div>
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flex: '1 0',
    background: theme.colors.background
  },
  footer: {
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
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
    padding: spacers.default,
    width: `calc(100% - ${spacers.get(2)}) !important`,
    flex: 1,
  },
  navigationMenu: {
    alignSelf: 'center',
    justifySelf: 'center',
    flex: 1,
  },
  title: {
    color: theme.text.baseColor,
    ...fonts.title1,
  },

  preFooter: {
    // background: theme.colors.neutralLightest,
    paddingBottom: spacers.default,
    boxShadow: getBoxShadow(0, 12, 12, -12, 'rgba(16, 30, 115, 0.08)'),
    position: 'relative',
  },
  text: {
    color: theme.colors.neutralDarkest,
  },
  responsive: {
    width: '100%',
    maxWidth: '1140px',
    margin: '0 auto',
  },
  centralizeContent: {
    display: 'flex',
    justifyContent: 'center',
  },
}));
