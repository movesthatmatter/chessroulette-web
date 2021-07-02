import React from 'react';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { colors, effects, onlyMobile, text } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { Text } from '../Text';
import { Link } from 'react-router-dom';
import { AnchorLink } from '../AnchorLink';
import { Instagram as InstagramIcon, Facebook as FacebookIcon } from 'grommet-icons';

type Props = {};

export const Footer: React.FC<Props> = () => {
  const cls = useStyles();

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
                  <InstagramIcon size="16px" className={cls.socialIcon} />
                  <Text size="body2">Instagram</Text>
                </AnchorLink>
                <AnchorLink
                  className={cls.socialLink}
                  baseColor={text.baseColor}
                  href="https://www.facebook.com/chessroulette/"
                  target="_blank"
                >
                  <FacebookIcon size="16px" className={cls.socialIcon} />
                  <Text size="body2">Facebook</Text>
                </AnchorLink>
              </div>
            </div>
            <div>
              <AnchorLink
                href="https://gabrielctroia.medium.com/meet-chessroulette-org-a-quarantine-project-e4108f05db39"
                className={cls.link}
              >
                <Text size="body2" className={cls.text}>
                  About
                </Text>
              </AnchorLink>
              <AnchorLink
                href="mailto:hi@chessroulette.org?subject=Hi from Chessroulette's Homepage"
                className={cls.link}
              >
                <Text size="body2" className={cls.text}>
                  Get In Touch
                </Text>
              </AnchorLink>
              <Link to="/privacy-policy" className={cls.link}>
                <Text size="body2" className={cls.text}>
                  Privacy Policy
                </Text>
              </Link>
              <Link to="/tos" className={cls.link}>
                <Text size="body2" className={cls.text}>
                  Terms of Service
                </Text>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const useStyles = createUseStyles({
  topContainer: {
    background: colors.neutralLightest,
    paddingBottom: '8px',
    ...effects.floatingShadow,
    position: 'relative',
  },
  centralizeContent: {
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    background: colors.neutralLighter,
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
    color: colors.neutralDarkest,
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
    },

    paddingLeft: spacers.larger,
  },
  text: {
    color: colors.neutralDarkest,
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
    color: text.baseColor,
  },

  row: {
    paddingTop: spacers.default,
    display: 'flex',
    flexDirection: 'row',

    ...onlyMobile({
      justifyContent: 'center',
    }),
  },
});
