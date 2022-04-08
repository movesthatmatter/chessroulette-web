import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTournamentWithFullDetails } from './resources';
import { TournamentWithFullDetailsRecord } from './types';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { TournamentPage } from './TournamentPage';
import { TournamentMatchRoute } from './TournamentMatchRoute';
import { TournamentWithFullDetailsMocker } from './mocks/TournamentWithFullDetailsMocker';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { useResource } from 'src/lib/hooks/useResource';
import { AwesomeErrorPage } from 'src/components/AwesomeError';

type Props = {};

const mockedTournament = new TournamentWithFullDetailsMocker().started(8, {
  withLive: true,
  withUnderway: true,
});

export const TournamentDetailsRoute: React.FC<Props> = React.memo(() => {
  const params = useParams<{ slug: string }>();
  const location = useLocation();
  let { path } = useRouteMatch();

  const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>();

  const getTournamentWithFullDetailsResource = useResource(getTournamentWithFullDetails);

  useEffect(() => {
    if (tournament) {
      return;
    }

    getTournamentWithFullDetailsResource.request({ tournamentId: params.slug }).map(setTournament);
  }, [params.slug]);

  if (getTournamentWithFullDetailsResource.hasFailed) {
    return <AwesomeErrorPage />;
  }

  if (tournament) {
    return (
      <Switch location={location}>
        <Route exact path={path} key={location.key}>
          <TournamentPage tournament={tournament} />
        </Route>
        <Route path={`${path}/matches/:matchSlug`} key={location.key}>
          <TournamentMatchRoute tournament={tournament} />
        </Route>
      </Switch>
    );
  }

  return <AwesomeLoaderPage />;
});
