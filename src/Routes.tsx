import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { LichessAuthCallbackPage } from './services/Authentication/widgets/LichessAuthCallbackPage';
import { StatsPage } from './modules/Stats';
import { ChallengePage } from './modules/Challenges';
import { LandingPageV2 } from './modules/Landing/LandingPageV2';
import { GA } from './services/Analytics';
import { ChallengeOrRoomPage } from './modules/Challenges/ChallengeOrRoomPage';
import { MobileGameRoomLayout } from './modules/GameRoomV2/GameRoomLayout/MobileGameRoomLayout';
import { WithLocalStream } from './storybook/WithLocalStream';
import { MultiStreamingBox } from './components/StreamingBox/MultiStreamingBox';
import { ChessPlayerMock } from './mocks/records';
import { FaceTime } from './components/FaceTimeArea';
import { ChessGame } from './modules/Games/Chess';
import { PlayerBox } from './modules/Games/Chess/components/GameStateWidget/components/PlayerBox';

type Props = {};

const playerMock = new ChessPlayerMock();

const playerA = playerMock.white;
const playerB = playerMock.black;

export const Routes: React.FC<Props> = () => {
  const location = useLocation();

  // const Home = () => (
  //   <MobileGameRoomLayout 
    
  //     getTopArea={(dimensions) => (
  //     // <div style={{
  //     //   // width: `${dimensions.width}px`,
  //     //   // height: `${dimensions.height}px`,
  //     //   width: '100%',
  //     //   height: '100%',
  //     //   background: 'blue'
  //     // }}>
  //       // {/* <div style={{
  //       //   width: '100%',
  //       //   height: '100%',
  //       //   background: 'green',
  //       // }}> */}
  //         // <WithLocalStream render={(stream) => (
  //         //   // <MultiStreamingBox />
  //         //   <FaceTime
  //         //     streamConfig={{
  //         //       on: true,
  //         //       type: 'audio-video',
  //         //       stream,
  //         //     }}
  //         //     // className={cls.fullFacetime}
  //         //     // aspectRatio={dimensions}
  //         //     aspectRatio={dimensions.height / dimensions.width}
  //         //     muted
  //         //   />
  //         // )}/>
  //         // {/* {`works? ${dimensions.width}/${dimensions.height}`} */}
  //       // {/* </div> */}
  //     // </div>
  //     // `works? ${dimensions.width}/${dimensions.height}`
  //     <WithLocalStream render={(stream) => (
  //       // <MultiStreamingBox />
  //       <FaceTime
  //         streamConfig={{
  //           on: true,
  //           type: 'audio-video',
  //           stream,
  //         }}
  //         // className={cls.fullFacetime}
  //         aspectRatio={dimensions}
  //         // aspectRatio={dimensions.height / dimensions.width}
  //         muted
  //       />
  //     )}
  //     />
  //   )}
  //   getMainArea={(dimensions) => (
  //     <>
  //       {/* <div className={cls.mobileAwayPlayerWrapper}>
  //         <PlayerBox
  //           player={playerA}
  //           timeLeft={122123}
  //           active={false}
  //           gameTimeLimit="bullet"
  //           material={2}
  //           // onTimerFinished={() => onTimerFinished(opponentPlayer.color)}
  //         />
  //       </div> */}
  //       <ChessGame
  //         // className={cls.board}
  //         homeColor={'white'}
  //         playable={true}
  //         pgn={''}
  //         getBoardSize={() => dimensions.width}
  //         onMove={(...args) => {
  //           // props.onMove(...args, homeColor);
  //         }}
  //         // game={props.room.activity.game}
  //         onRewind={() => {
  //           // setGameDisplayedHistoryIndex((prev) => prev + 1);
  //         }}
  //         onForward={() => {
  //           // setGameDisplayedHistoryIndex((prev) => prev - 1);
  //         }}
  //         // displayedHistoryIndex={gameDisplayedHistoryIndex}
  //       />
  //       {/* <div className={cls.mobileHomePlayerWrapper}>
  //         <PlayerBox
  //           player={playerB}
  //           timeLeft={122123}
  //           active={true}
  //           gameTimeLimit="bullet"
  //           material={2}
  //           // onTimerFinished={() => onTimerFinished(opponentPlayer.color)}
  //         />
  //       </div> */}
  //       </>
  //     )}
  //   />
  // )

  return (
    <Switch location={location}>
      <Route
        path="/auth/lichess/callback"
        key={location.key}
        exact
        component={LichessAuthCallbackPage}
      />
      <Route exact strict path="/stats" key={location.key} component={StatsPage} />
      <Route exact strict path="/:slug" key={location.key} component={ChallengeOrRoomPage} />
      <Route exact strict path="/mobile" key={location.key} component={MobileGameRoomLayout} />
      <Route exact path="/" component={LandingPageV2} />
    </Switch>
  );
};
