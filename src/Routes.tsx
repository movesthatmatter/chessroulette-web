import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { LichessAuthCallbackPage } from './vendors/lichess/LichessAuthCallbackPage';
import { StatsPage } from './modules/Stats';
import { LandingPage } from './modules/Landing/LandingPage';
import { ChallengeOrRoomPage } from './modules/Challenges/ChallengeOrRoomPage';
import { FacebookAuthCallbackPage } from './vendors/facebook';
import { PeerProvider } from './providers/PeerProvider';
import { SocketProvider } from './providers/SocketProvider';
import { UserProfilePage } from './modules/User';

type Props = {};

export const Routes: React.FC<Props> = () => {
  const location = useLocation();

  return (
    <Switch location={location}>
      <Route
        path="/vendors/lichess/auth/callback"
        key={location.key}
        exact
        component={LichessAuthCallbackPage}
      />
      <Route
        path="/vendors/facebook/auth/callback"
        key={location.key}
        exact
        component={FacebookAuthCallbackPage}
      />
      <Route
        path="/user/:section"
        key={location.key}
        exact
        component={UserProfilePage}
      />
      <SocketProvider>
        <PeerProvider>
          <Route exact strict path="/stats" key={location.key} component={StatsPage} />
          <Route exact strict path="/:slug" key={location.key} component={ChallengeOrRoomPage} />
          <Route exact path="/" component={LandingPage} />
        </PeerProvider>
      </SocketProvider>
    </Switch>
  );
};
