import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { LichessAuthCallbackPage } from './vendors/lichess/LichessAuthCallbackPage';
import { LandingPage } from './modules/Landing/LandingPage';
import { FacebookAuthCallbackPage } from './vendors/facebook';
import { PeerProvider } from './providers/PeerProvider';
import { SocketProvider } from './providers/SocketProvider';
import { UserProfilePage } from './modules/User';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TOS } from './pages/TOS';
import { TwitchCallbackPage } from './vendors/twitch/TwitchCallbackPage/TwitchCallBackPage';
import { LivePage } from './modules/Live';
import { PlayLichess } from './modules/LichessPlay/PlayLichess/PlayLichess';
import { RoomRoute } from './modules/Room';

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
        path="/vendors/twitch/auth/callback"
        exact
        key={location.key}
        component={TwitchCallbackPage}
      />
      <Route path="/privacy-policy" key={location.key} exact component={PrivacyPolicy} />
      <Route path="/tos" key={location.key} exact component={TOS} />
      <Route path="/user/:section" key={location.key} exact component={UserProfilePage} />
      <Route path="/live" key={location.key} exact component={LivePage} />
      <Route exact strict path='/lichess' key={location.key} component={PlayLichess}/>

      <SocketProvider>
        <PeerProvider>
          <Route exact strict path="/:slug" key={location.key} component={RoomRoute} />
          <Route exact path="/" component={LandingPage} />
        </PeerProvider>
      </SocketProvider>
    </Switch>
  );
};
