import React from 'react';
import { CircularButton } from 'src/components/CircularButton';
import { createStyles, StyledProps } from 'src/lib/jss';
import chessBackground from './assets/chessboard22.jpg';

type Props = StyledProps<typeof styles> & {};

export const SplashScreen: React.FC<Props> = ({ classes }) =>
  (
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
        <div className={classes.videoButtonContainer}>
          <CircularButton
            type="chat"
            color="#08D183"
            onClick={() => console.log('clicked')}
          />
        </div>
      </div>
    </div>
  );

const [styles, withStyle] = createStyles({
  container: {
    position: 'relative',
    bottom: '0%',
    left: '80%',
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
    // back
  },
  videoButtonContainer: {
    position: 'relative',
    left: '90%',
    bottom: '20%',
  },
});

export const SplashScreenBoardWithButtons = withStyle(SplashScreen);
