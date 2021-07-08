import React, { useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Logo } from 'src/components/Logo';
import { Footer } from '../Footer';
import { NavigationMenu } from '../Navigation/NavigationMenu';
import { colors, effects, fonts, text } from 'src/theme';
import { Events } from 'src/services/Analytics';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';
import { Text } from '../Text';

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
    display: 'flex',
    flexDirection: 'column',
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
    padding: spacers.default,
    width: `calc(100% - ${spacers.get(2)})`,
    flex: 1,
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

  preFooter: {
    background: colors.neutralLightest,
    paddingBottom: spacers.default,
    ...effects.floatingShadow,
    position: 'relative',
  },
  text: {
    color: colors.neutralDarkest,
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
});
