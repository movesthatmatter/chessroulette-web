import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { LichessAuthCallbackPage } from './vendors/lichess/LichessAuthCallbackPage';
import { LandingPage } from './modules/Landing/LandingPage';
import { FacebookAuthCallbackPage } from './vendors/facebook';
import { SocketProvider } from './providers/SocketProvider';
import { UserProfilePage } from './modules/User';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TOS } from './pages/TOS';
import { TwitchCallbackPage } from './vendors/twitch/TwitchCallbackPage/TwitchCallBackPage';
import { RoomRoute } from './modules/Room';
import { PeerProviderContainer } from './providers/PeerProvider/PeerProviderContainer';
import { RelayInputRoute } from './modules/Relay/RelayInput';
import { LiveRoute } from './modules/Live/LiveRoute';
import { ActivityRoute } from './modules/Activity/ActivityRoute';

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
      {/* <Route exact strict path="/lichess" key={location.key} component={PlayLichess} /> */}
      <Route path="/watch/:streamer" key={location.key} component={LiveRoute} />
      <Route path="/watch" key={location.key} component={LiveRoute} />

      <SocketProvider>
        <PeerProviderContainer>
          <Route path="/relay-input" strict exact component={RelayInputRoute} />
          <Route exact strict path="/r/:slug" key={location.key} component={RoomRoute} />
          <Route exact strict path="/analyses/:id" key={location.key} component={ActivityRoute} />
          <Route exact path="/" component={LandingPage} />
        </PeerProviderContainer>
      </SocketProvider>
    </Switch>
  );
};
