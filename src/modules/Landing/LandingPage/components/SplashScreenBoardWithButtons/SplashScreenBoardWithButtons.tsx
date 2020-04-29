import React from 'react';
import { CircularButton } from 'src/components/CircularButton';
import { createStyles } from 'src/lib/jss';
import chessBackground from './assets/chessboard.jpg';

type Props = {};

const styled = createStyles({
  container: {
    position: 'relative',
  },
  chessboard: {
    width: '280px',
    height: '278px',
    boxShadow: ' 0px 4px 9px rgba(0, 0, 0, 0.58)',
    borderRadius: ' 47px',
    backgroundImage: `url(${chessBackground})`,
  },
  playButtonContainer: {
    position: 'relative',
    right: '20%',
    top: '50%',
  },
  videoButtonContainer: {
    position: 'relative',
    left: '90%',
    bottom: '20%',
  },
  chatButtonContainer: {
    position: 'relative',
    left: '75%',
    top: '10%',
  },
});

export const SplashScreenBoardWithButtons = styled<Props>(({ classes }) => (
  <div className={classes.container}>
    <div className={classes.chessboard}>
      <div className={classes.playButtonContainer}>
        <CircularButton
          type="play"
          color="#54C4F2"
          onClick={() => console.log('clicked')}
        />
      </div>
      <div className={classes.videoButtonContainer}>
        <CircularButton
          type="video"
          color="#E66162"
          onClick={() => console.log('clicked')}
        />
      </div>
      <div className={classes.chatButtonContainer}>
        <CircularButton
          type="chat"
          color="#08D183"
          onClick={() => console.log('clicked')}
        />
      </div>
    </div>
  </div>
));
