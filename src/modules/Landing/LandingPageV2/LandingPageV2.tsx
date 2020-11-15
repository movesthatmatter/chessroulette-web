import React from 'react';
import { Page } from 'src/components/Page';
import { Box } from 'grommet';
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
      <Box alignContent="center" justify="center" style={{ height: '100%' }}>
        <Box width="xlarge" alignSelf="center" direction="row-responsive">
          <Box
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
            />
          </Box>
          <div style={{ paddingRight: '32px' }} />
          <Box
            style={{
              flex: 1,
              alignSelf: 'center',
            }}
          >
            <h2 className={cls.headerText}>
              Online Chess +<br />
              Video Streaming
            </h2>
            <Text className={cls.text}>No account needed.</Text>
            <Text className={cls.text}>Game hosting and video chat.</Text>
            <Text className={cls.text}>
              Play with friends in a private lobby or start a quick game.
            </Text>
            <Box width="small" margin={{ top: 'large' }} alignSelf="center" fill direction="row">
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
            </Box>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

const useStyles = createUseStyles({
  headerText: {
    marginTop: 0,
    fontSize: '48px',
    lineHeight: '140%',
  },
  text: {
    fontFamily: 'Roboto Slab',
    fontSize: '18px',
    lineHeight: '1.6em',
    color: colors.neutralDarkest,
  },
});
