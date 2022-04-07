import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTournamentWithFullDetails } from './resources';
import { TournamentWithFullDetailsRecord } from './types';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { TournamentPage } from './TournamentPage';
import { TournamentMatchRoute } from './TournamentMatchRoute';
import { PeerToServerConsumer } from 'src/providers/PeerConnectionProvider';
import { TournamentWithFullDetailsMocker } from './mocks/TournamentWithFullDetailsMocker';

type Props = {};

const tournamentMocker = new TournamentWithFullDetailsMocker();

export const TournamentDetailsRoute: React.FC<Props> = React.memo(() => {
  const params = useParams<{ slug: string }>();
  const location = useLocation();
  let { path } = useRouteMatch();

  const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>();

  useEffect(() => {
    if (tournament) {
      return;
    }

    getTournamentWithFullDetails({ tournamentId: params.slug }).map((tournament) => {
      setTournament(tournament);
    });

    // setTournament(tournamentMocker.withLiveGame(6));

  }, [params.slug]);

  if (!tournament) {
    return null;
  }

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
});
