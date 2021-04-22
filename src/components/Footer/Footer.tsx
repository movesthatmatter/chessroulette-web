import React from 'react';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { colors, effects, onlyMobile } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { Text } from '../Text';
import { Link } from 'react-router-dom';
import cx from 'classnames';


type Props = {};

export const Footer: React.FC<Props> = () => {
  const cls = useStyles();

  return (
    <>
      <div className={cls.topContainer}>
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
      <div className={cls.container}>
        <div className={cls.responsive}>
          <div className={cls.content}>
            <div>
              <Text size="body2" className={cls.text}>
                © 2021 Chessroulette: A Moves That Matter LLC Project.
              </Text>
              <br />
            </div>
            <div>
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

      ...{
        '& $link': {
          paddingLeft: spacers.small,
          paddingRight: spacers.small,
        },
      } as NestedCSSElement,
    })
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
});
