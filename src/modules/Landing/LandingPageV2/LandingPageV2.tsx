import React from 'react';
import { Page } from 'src/components/Page';
import { Text } from 'src/components/Text';
import { ChallengeButtonWidget } from 'src/modules/Games/Chess/components/ChallengeButtonWidget';
import chessBackground from '../LandingPage/assets/chess_icons.png';
import { createUseStyles } from 'src/lib/jss';
import { colors } from 'src/theme';

type Props = {};

export const LandingPageV2: React.FC<Props> = () => {
  const cls = useStyles();

  return (
    <Page>
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
          <div style={{ paddingRight: '32px' }} />
          <div
            style={{
              flex: 1,
              alignSelf: 'center',
            }}
          >
            <h1 className={cls.headerText}>
              Where Chess meets
              <br/>
              Video Streaming
            </h1>
            <h3 className={cls.text}>No account needed.</h3>
            <h3 className={cls.text}>Game hosting and video chat.</h3>
            <h3 className={cls.text}>
              Play with friends in a private lobby or start a quick game.
            </h3>
            <div className={cls.buttonWrapper}>
              <ChallengeButtonWidget
                label="Play a Friend"
                challengeType="challenge"
                size="medium"
                style={{
                  marginRight: '16px',
                }}
              />
              <ChallengeButtonWidget
                label="Quick Game"
                challengeType="quickPairing"
                size="medium"
                type="secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  inner: {
    display: 'flex',
    alignSelf: 'center',
    maxWidth: '100%',
    width: '1152px',
  },
  headerText: {
    marginTop: 0,
    fontSize: '48px',
    lineHeight: '140%',
    fontWeight: 800,
  },
  text: {
    fontSize: '18px',
    lineHeight: '1em',
    color: colors.neutralDarkest,
    display: 'block',
    fontWeight: 'normal',
  },
  buttonWrapper: {
    marginTop: '48px',
    display: 'flex',
    flexDirection: 'row',
  },
});
