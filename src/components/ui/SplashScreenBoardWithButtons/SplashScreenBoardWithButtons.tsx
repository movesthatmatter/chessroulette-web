import React from "react";
import CircularButton from '../CircularButton/CircularButton';
import './SplashScreenBoardWithButtons.css';


const SplashScreenBoardWithButtons = () => (
  <div className="chessboardContainer">
    <div className="chessboard">
      <div className="playButtonContainer">
        <CircularButton
          imageURL="play-circle"
          color="#D64349"
          onClickFunction={() => console.log("clicked")}
        />
      </div>
      <div className="videoButtonContainer">
        <CircularButton
          imageURL="video"
          color="#983A7E"
          onClickFunction={() => console.log("clicked")}
        />
      </div>
      <div className="chatButtonContainer">
        <CircularButton
          imageURL="message-circle"
          color="#1C2C84"
          onClickFunction={() => console.log("clicked")}
        />
      </div>
    </div>
  </div>
);

export default SplashScreenBoardWithButtons;