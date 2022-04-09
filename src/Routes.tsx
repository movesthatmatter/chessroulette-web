import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { LichessAuthCallbackPage } from './vendors/lichess/LichessAuthCallbackPage';
import { LandingPage } from './modules/Landing/LandingPage';
import { FacebookAuthCallbackPage } from './vendors/facebook';
import { UserProfilePage } from './modules/User';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TOS } from './pages/TOS';
import { TwitchCallbackPage } from './vendors/twitch/TwitchCallbackPage/TwitchCallBackPage';
import { RoomRoute } from './modules/Room';
import { RelayInputRoute } from './modules/Relay/RelayInput';
import { LiveRoute } from './modules/Live/LiveRoute';
import { CuratedEventsConsoleRoute } from './modules/CuratedEvents/console/CuratedEventsConsoleRoute';
import { TournamentsRoute } from './modules/Tournaments';
import { CuratedEventRoute } from './modules/CuratedEvents';

type Props = {};

export const Routes: React.FC<Props> = () => {
  const location = useLocation();

  return (
    <Switch>
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
      <Route path="/events/:slug" exact strict key={location.key} component={CuratedEventRoute} />
      {/* console/admin routes */}
      <Route path="/e4e5f4Be7/console/relay-input" strict exact component={RelayInputRoute} />
      <Route
        path="/e4e5f4Be7/console/curated-events"
        strict
        exact
        component={CuratedEventsConsoleRoute}
      />
      <Route path="/relay-input" strict exact component={RelayInputRoute} />
      <Route exact strict path="/" component={LandingPage} />

      {/* This is only for the Room - TODO: Rename to RoomProvider or something */}

      <Route exact strict path="/r/:slug" key={location.key} component={RoomRoute} />
      <Route exact strict path="/classroom/:slug" key={location.key} component={RoomRoute} />
      <Route path="/tournaments" key={location.key} component={TournamentsRoute}/>
      {/* <Route path="/wcc" exact strict key={location.key} component={BroadcastPage} /> */}
      <Route exact strict path="/classroom/:slug" key={location.key} component={RoomRoute} />
      <Route exact strict path="/tournaments/:slug" key={location.key} component={TournamentsRoute} />
      <Route exact strict path="/tournaments" key={location.key} component={TournamentsRoute} />
    </Switch>
  );
};
