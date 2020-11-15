import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { LichessAuthCallbackPage } from './services/Authentication/widgets/LichessAuthCallbackPage';
import { StatsPage } from './modules/Stats';
import { ChallengePage } from './modules/Challenges';
import { LandingPageV2 } from './modules/Landing/LandingPageV2';

type Props = {};

export const Routes: React.FC<Props> = () => {
  const location = useLocation();

  return (
    <Switch location={location}>
      <Route
        path="/auth/lichess/callback"
        key={location.key}
        exact
        component={LichessAuthCallbackPage}
      />
      <Route exact strict path="/stats" key={location.key} component={StatsPage} />
      <Route exact strict path="/:slug" key={location.key} component={ChallengePage} />
      <Route exact strict path="/" key={location.key} component={LandingPageV2} />
    </Switch>
  );
};
