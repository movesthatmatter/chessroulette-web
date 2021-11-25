import React, { useEffect, useMemo } from 'react';
import cx from 'classnames';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { Logo } from 'src/components/Logo';
import { Footer } from '../Footer';
import { NavigationMenu } from '../Navigation/NavigationMenu';
import { fonts, onlyMobile } from 'src/theme';
import { Events } from 'src/services/Analytics';
import { spacers } from 'src/theme/spacers';
import { Text } from '../Text';
import { getBoxShadow } from 'src/theme/util';
import { useBodyClass } from 'src/lib/hooks/useBodyClass';

export type PageProps = {
  // This name will be used on analytics
  // name: string;
  title?: string;
  contentClassName?: string;
  footerClassName?: string;
  containerClassname?: string;
  logoAsLink?: boolean;
  stretched?: boolean;
  hideNav?: boolean;
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

export const Page: React.FC<PageProps> = ({ logoAsLink = true, stretched = false, ...props }) => {
  const cls = useStyles();
  useBodyClass([cls.indexBackground]);
  useEffect(() => {
    if (props.name) {
      Events.trackPageView(props.name);
    }
  }, [props.name]);

  const responsiveCls = useMemo(() => (stretched ? cls.responsiveStretched : cls.responsive), [
    stretched,
  ]);

  return (
    <div className={cls.root}>
      <div className={`${cls.container} ${props.containerClassname}`}>
        <div className={`${cls.content} ${props.contentClassName}`}>
          {!props.hideNav && <div className={cls.top}>
            <div className={cx(cls.topMain, responsiveCls)}>
              <div style={{ width: '300px' }}>
                <Logo asLink={logoAsLink} withBeta />
              </div>
              <div className={cls.navigationMenu}>
                <NavigationMenu />
              </div>
            </div>
          </div>}
          <main className={`${cls.main} ${responsiveCls}`}>
            {props.title && <h1 className={cls.title}>{props.title}</h1>}
            {props.children}
          </main>
          <div className={cls.preFooter}>
            <div className={cx(responsiveCls, cls.centralizeContent)}>
              {/* <div className={cls.preFooterSide} /> */}
              <div className={cls.centralContent}>
                <Text size="body2" className={cls.text}>
                  Made with ❤️around the world!
                </Text>
              </div>
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

const useStyles = createUseStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  indexBackground: {
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: '1 0',
    background: theme.colors.background,
    color: theme.text.baseColor,
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
    padding: `${spacers.large} ${spacers.larger}`,
  },
  topRight: {
    justifySelf: 'flex-end',
  },
  main: {
    padding: spacers.larger,
    width: `calc(100% - ${spacers.largerPx * 2}px) !important`,
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
    paddingTop: spacers.get(6),
    paddingBottom: spacers.default,
    boxShadow: getBoxShadow(0, 12, 12, -12, 'rgba(16, 30, 115, 0.08)'),
    position: 'relative',
    paddingLeft: spacers.default,
    paddingRight: spacers.default,
  },
  text: {
    color: theme.colors.neutralDarkest,
    fontWeight: 300,
  },
  responsive: {
    margin: '0 auto',
    maxWidth: '1140px',
  },
  responsiveStretched: {
    maxWidth: 'auto',
    width: '100%',
  },
  centralizeContent: {
    display: 'flex',
    justifyContent: 'flex-end',
    justifyItems: 'flex-end',
    flex: 1,

    ...onlyMobile({
      ...makeImportant({
        display: 'block',
      }),
    }),
  },
  centralContent: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
  },
  preFooterSide: {
    width: '25%',
    minWidth: '150px',
    ...onlyMobile({
      display: 'none',
    }),
  },
  discordButtonSide: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  discordButton: {
    ...onlyMobile({
      display: 'none',
    }),
    marginBottom: 0,
  },
}));
