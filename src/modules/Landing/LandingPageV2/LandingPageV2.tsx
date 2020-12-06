import React, { useEffect } from 'react';
import { Page } from 'src/components/Page';
import { ChallengeButtonWidget } from 'src/modules/Games/Chess/components/ChallengeButtonWidget';
import chessBackground from '../LandingPage/assets/chess_icons.png';
import { createUseStyles } from 'src/lib/jss';
import { colors, minMediaQuery, maxMediaQuery } from 'src/theme';
import cx from 'classnames';
import { Events } from 'src/services/Analytics';

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
                width: '100%',
                maxWidth: '500px',
              }}
              alt="Chessroulette Board"
            />
          </div>
          <div className={cls.rightSide}>
            <h1 className={cls.headerText}>Chessroulette</h1>
            <h2 className={cls.subheaderText}>Where Chess meets Video.</h2>
            <h3 className={cls.text}>No account needed.</h3>
            <h3 className={cls.text}>Game hosting and video chat.</h3>
            <h3 className={cls.text}>
              Play with friends in a private lobby or start a quick game.
            </h3>
            <div className={cls.buttonWrapper}>
              <ChallengeButtonWidget
                label="Play a Friend"
                challengeType="challenge"
                style={{
                  marginRight: '16px',
                }}
              />
              <ChallengeButtonWidget
                label="Quick Game"
                challengeType="quickPairing"
                type="secondary"
              />
            </div>
            {/* <div className={cls.mobileOnly}>
              <span className={cls.noMobileDisclaimerText}>
                Please switch to a bigger screen to Play!
              </span>
            </div> */}
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
    fontSize: '100%',
    lineHeight: '140%',
    fontWeight: 800,
  },
  subheaderText: {
    marginTop: 0,
    fontSize: '60%',
    lineHeight: '100%',
    fontWeight: 400,

    ...minMediaQuery(tabletBreakPoint, {
      marginBottom: '48px',
    }),
  },
  text: {
    fontSize: '30%',
    lineHeight: '1em',
    color: colors.neutralDarkest,
    display: 'block',
    fontWeight: 'normal',
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
