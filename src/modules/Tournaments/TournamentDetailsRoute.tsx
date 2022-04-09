import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTournamentWithFullDetails } from './resources';
import { TournamentWithFullDetailsRecord } from './types';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { TournamentPage } from './TournamentPage';
import { TournamentMatchRoute } from './TournamentMatchRoute';
import { TournamentWithFullDetailsMocker } from './mocks/TournamentWithFullDetailsMocker';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { useCachedResource, useResource } from 'src/lib/hooks/useResource';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { useAuthentication } from 'src/services/Authentication';

type Props = {};

const mockedTournament = new TournamentWithFullDetailsMocker().started(8, {
  withLive: true,
  withUnderway: true,
});

export const TournamentDetailsRoute: React.FC<Props> = React.memo(() => {
  const params = useParams<{ slug: string }>();
  const location = useLocation();
  let { path } = useRouteMatch();
  const auth = useAuthentication();

  const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>();

  // TODO: Don't leave it as cached resource!
  const getTournamentWithFullDetailsResource = useCachedResource(getTournamentWithFullDetails);

  useEffect(() => {
    if (tournament) {
      return;
    }
    setTournament(mockedTournament);
    // getTournamentWithFullDetailsResource.request({ tournamentId: params.slug }).map(setTournament);
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
