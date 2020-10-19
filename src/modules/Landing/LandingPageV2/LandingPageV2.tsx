import React from 'react';
import { Page } from 'src/components/Page';
import { Box, Text } from 'grommet';
import { useHistory } from 'react-router-dom';
import { selectAuthentication } from 'src/services/Authentication';
import { useSelector } from 'react-redux';
import { ChallengeButtonWidget } from 'src/modules/Games/Chess/components/ChallengeButtonWidget';
import chessBackground from '../LandingPage/assets/chess_icons.png';
import logo from 'src/assets/logo.svg';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';

type Props = {};

export const LandingPageV2: React.FC<Props> = () => {
  const cls = useStyles();
  const authentication = useSelector(selectAuthentication);

  // This should never happen
  if (authentication.authenticationType === 'none') {
    return null;
  }

  return (
    <Page>
      <Box
        alignContent="center"
        justify="center"
        style={{
          height: '100%',
        }}
      >
        <Box
          alignSelf="center"
          justify="center"
          style={{
            margin: '0 auto',
            width: '60%',
            minWidth: '850px',
            maxWidth: '850px',
            paddingBottom: '50px',
          }}
        >
          <h3 className={cls.headerText}>Play chess online with video streaming</h3>
          <Box direction="row-responsive" alignContent="between">
            <Box margin={{ top: '60px' }} flex="grow">
              <Text>No account needed.</Text>
              <Text>Game hosting and video chat.</Text>
              <Text>Play with friends in a private lobby</Text>
              <Text>or start a quick game.</Text>
            </Box>
            <Box alignContent="end" alignSelf="end">
              <Mutunachi mid={12} className={cls.mutunachi} />
            </Box>
            <Box align="end" alignSelf="end" margin={{ bottom: '-30px' }}>
              <div className={cls.chessboard} />
            </Box>
          </Box>
        </Box>
        <Box width="medium" alignSelf="center">
          <ChallengeButtonWidget
            buttonLabel="Play a Friend"
            userId={authentication.user.id}
            type="challenge"
          />
          <ChallengeButtonWidget
            buttonLabel="Quick Game"
            userId={authentication.user.id}
            type="quickPairing"
          />
        </Box>
      </Box>
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {
    fontFamily: 'Open Sans, sans-serif',
  },
  chessboard: {
    width: '360px',
    height: '321px',
    background: ` url(${chessBackground})`,
  },
  headerText: {
    fontFamily: 'Roboto Slab',
    fontWeight: 'bold',
    fontSize: '48px',
    lineHeight: '63px',
    margin: '0 auto',
    color: '#262626',
    position: 'relative',
    zIndex: 2,
  },
  buttonsContainer: {
    marginTop: '80px',
    marginLeft: '100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'spaced-around',
  },
  logo: {
    marginBottom: '20px',
    width: '357px',
  },
  text: {
    fontFamily: 'Roboto Slab',
    fontSize: '18px',
  },
  link: {
    margin: '0px',
    maxWidth: '100px',
    borderRadius: '15px',
    backgroundColor: '#e9685a',
    textAlign: 'center',
    color: 'white',
    textDecoration: 'none',

    '&:hover': {
      transform: 'scale(1.05)',
      textDecoration: 'none',
      cursor: 'pointer',
      backgroundColor: '#e9685a',
    },
  },
  linkContent: {
    padding: '10px',
  },
  leftSideContainer: {
    display: 'flex',
    width: '575px',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  buttonWithMutunachiWrapper: {
    position: 'relative',
  },
  mutunachi: {
    // position: 'absolute',
    // zIndex: 1,
    // top: `-${171 + 50}px`,
    // left: '12%',
    height: '220px',
  },
});
