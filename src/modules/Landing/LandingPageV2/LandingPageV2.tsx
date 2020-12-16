import React, { useEffect } from 'react';
import { Page } from 'src/components/Page';
import { ChallengeButtonWidget } from 'src/modules/Games/Chess/components/ChallengeButtonWidget';
import chessBackground from '../LandingPage/assets/chess_icons.png';
import { createUseStyles } from 'src/lib/jss';
import { colors, minMediaQuery, maxMediaQuery, onlyMobile, onlySmallMobile } from 'src/theme';
import { Events } from 'src/services/Analytics';
import { fonts } from 'src/theme/fonts';
import { Emoji } from 'src/components/Emoji';

type Props = {};

export const LandingPageV2: React.FC<Props> = () => {
  const cls = useStyles();

  useEffect(() => {
    Events.trackPageView('Home');
  }, []);

  return (
    <Page logoAsLink={false}>
      <div className={cls.container}>
        <div className={cls.inner}>
          <div
            style={{
              flex: 1,
              alignItems: 'flex-end',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <img
              src={chessBackground}
              style={{
                width: '95%',
                margin: '0 auto',
                maxWidth: '500px',
              }}
              alt="Chessroulette Board"
            />
          </div>
          <div className={cls.rightSide}>
            <h1 className={cls.headerText}>Chessroulette</h1>
            <h2 className={cls.subheaderText}>Where Chess Meets Video</h2>

            <div className={cls.list}>
              <h3 className={cls.text}>Play with friends in a private room.</h3>
              <h3 className={cls.text}>Start a quick game with someone across the world.</h3>
              <h3 className={cls.text}>Face to Face. Live. Free. <Emoji symbol="😎" /></h3>
            </div>
            <div className={cls.buttonWrapper}>
              <ChallengeButtonWidget
                label="Play Friend"
                challengeType="private"
                size="small"
                style={{
                  marginRight: '16px',
                }}
              />
              <ChallengeButtonWidget
                label="Quick Game"
                size="small"
                challengeType="public"
                type="secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

const tabletBreakPoint = 600;
const desktopBreakPoint = 769;

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',

    fontSize: '32px',

    ...minMediaQuery(tabletBreakPoint, {
      fontSize: '40px',
    }),

    ...minMediaQuery(desktopBreakPoint, {
      fontSize: '60px',
    }),
  },
  inner: {
    display: 'flex',
    alignSelf: 'center',
    maxWidth: '100%',
    width: '1152px',

    ...maxMediaQuery(tabletBreakPoint, {
      flexDirection: 'column',
    }),
  },
  headerText: {
    margin: 0,
    fontSize: '110%',
    lineHeight: '140%',
    fontWeight: 800,

    ...onlyMobile({
      fontSize: '130%',
    }),
  },
  subheaderText: {
    marginTop: 0,
    fontSize: '60%',
    lineHeight: '100%',
    fontWeight: 400,

    ...onlyMobile({
      fontSize: '70%',
      marginBottom: '48px',
    }),
  },
  list: {},
  text: {
    ...fonts.body1,
    lineHeight: '1em',
    color: colors.neutralDarkest,

    ...onlySmallMobile({
      fontSize: '12px',
    }),
  },
  buttonWrapper: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',

    ...minMediaQuery(tabletBreakPoint, {
      marginTop: '48px',
      justifyContent: 'flex-start',
    }),
  },
  rightSide: {
    flex: 1,
    textAlign: 'center',

    ...minMediaQuery(tabletBreakPoint, {
      alignSelf: 'center',
      textAlign: 'left',
    }),
  },
  noMobileDisclaimerText: {
    fontSize: '40%',
    lineHeight: '40%',
  },
  desktopOnly: {
    ...maxMediaQuery(tabletBreakPoint, {
      display: 'none',
    }),
  },
  mobileOnly: {
    ...minMediaQuery(tabletBreakPoint, {
      display: 'none',
    }),
  },
});
