import React from 'react';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { CustomTheme, onlyMobile } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { Text } from '../Text';
import { Link } from 'react-router-dom';
import { AnchorLink } from '../AnchorLink';
import { Instagram as InstagramIcon, Facebook as FacebookIcon } from 'grommet-icons';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';

type Props = {};

export const Footer: React.FC<Props> = () => {
  const cls = useStyles();
  const {theme} = useColorTheme();
  const text = theme.text;
  return (
    <>
      <div className={cls.container}>
        <div className={cls.responsive}>
          <div className={cls.content}>
            <div>
              <Text size="body2" className={cls.text}>
                © 2021 Chessroulette: A Moves That Matter LLC Project.
              </Text>
              <div className={cls.row}>
                <AnchorLink
                  className={cls.socialLink}
                  href="https://www.instagram.com/chessroulette/"
                  target="_blank"
                  baseColor={text.baseColor}
                >
                  <InstagramIcon size="16px" className={cls.socialIcon} color={theme.text.subtle}/>
                  <Text size="body2" className={cls.text}>Instagram</Text>
                </AnchorLink>
                <AnchorLink
                  className={cls.socialLink}
                  baseColor={text.baseColor}
                  href="https://www.facebook.com/chessroulette/"
                  target="_blank"
                >
                  <FacebookIcon size="16px" className={cls.socialIcon} color={theme.text.subtle}/>
                  <Text size="body2" className={cls.text}>Facebook</Text>
                </AnchorLink>
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div className={cls.linkContainerSpacer}>
              <AnchorLink
                href="https://gabrielctroia.medium.com/meet-chessroulette-org-a-quarantine-project-e4108f05db39"
                className={cls.link}
                target='blank'
              >
                <Text size="body2" className={cls.text}>
                  About
                </Text>
              </AnchorLink>
              </div>
              <div className={cls.linkContainerSpacer}>
              <AnchorLink
                href="mailto:hi@chessroulette.org?subject=Hi from Chessroulette's Homepage"
                className={cls.link}
              >
                <Text size="body2" className={cls.text}>
                  Get In Touch
                </Text>
              </AnchorLink>
              </div>
              <div className={cls.linkContainerSpacer}>
              <Link to="/privacy-policy" className={cls.link}>
                <Text size="body2" className={cls.text}>
                  Privacy Policy
                </Text>
              </Link>
              </div>
              <div className={cls.linkContainerSpacer}>
              <Link to="/tos" className={cls.link}>
                <Text size="body2" className={cls.text}>
                  Terms of Service
                </Text>
              </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  topContainer: {
    background: theme.colors.neutralLightest,
    paddingBottom: '8px',
    ...theme.floatingShadow,
    position: 'relative',
  },
  centralizeContent: {
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    background: theme.colors.neutralLighter,
  },
  responsive: {
    width: '100%',
    maxWidth: '1140px',
    margin: '0 auto',
  },
  content: {
    padding: '16px 16px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

    ...onlyMobile({
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',

      ...({
        '& $link': {
          paddingLeft: spacers.small,
          paddingRight: spacers.small,
        },
      } as NestedCSSElement),
    }),
  },
  link: {
    color: theme.colors.neutralLightest,
    textDecoration: 'none',

    '&:hover': {
      borderBottom: `2px solid ${theme.colors.neutralDarkest}`
    },
  },
  text: {
    color: theme.text.subtle,
  },
  socialLink: {
    verticalAlign: 'center',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: spacers.small,
    marginLeft: spacers.large,

    '&:first-child': {
      marginLeft: 0,
    },
  },
  socialIcon: {
    marginRight: spacers.small,
  },
  socialLinkText: {
    color: theme.text.baseColor,
  },
  linkContainerSpacer: {
    paddingLeft: spacers.larger,
  },
  row: {
    paddingTop: spacers.default,
    display: 'flex',
    flexDirection: 'row',

    ...onlyMobile({
      justifyContent: 'center',
    }),
  },
}));
