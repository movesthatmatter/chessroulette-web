import React from 'react';
import { CircularButton } from 'src/components/CircularButton';
import './SplashScreenBoardWithButtons.css';

type Props = {}

export const SplashScreenBoardWithButtons: React.FC<Props> = () => (
  <div className="chessboardContainer">
    <div className="chessboard">
      <div className="playButtonContainer">
        <CircularButton
          type="play"
          color="#54C4F2"
          onClick={() => console.log('clicked')}
        />
      </div>
      <div className="videoButtonContainer">
        <CircularButton
          type="video"
          color="#E66162"
          onClick={() => console.log('clicked')}
        />
      </div>
      <div className="chatButtonContainer">
        <CircularButton
          type="chat"
          color="#08D183"
          onClick={() => console.log('clicked')}
        />
      </div>
    </div>
  </div>
);
