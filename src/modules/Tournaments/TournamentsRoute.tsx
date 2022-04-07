import React, { useEffect } from 'react';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { TournamentDetailsRoute } from './TournamentDetailsRoute';
import { TournamentsPage } from './TournamentsPage/TournamentsPage';
import { TournamentMatchRecord } from './types';

type Props = {
  match: TournamentMatchRecord;
};

export const TournamentsRoute: React.FC<Props> = React.memo(() => {
  const location = useLocation();
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} key={location.key} component={TournamentsPage} />
      <Route path={`${path}/:slug`} key={location.key} component={TournamentDetailsRoute} />
    </Switch>
  );
});
