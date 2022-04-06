import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from 'src/components/Page';
import { getTournamentWithFullDetails } from './resources';
import { TournamentWithFullDetailsMocker } from './mocks/TournamentWithFullDetailsMocker';

import { TournamentPage } from './TournamentPage/TournamentPage';
import { TournamentWithFullDetailsRecord } from './types';
import { useAuthentication } from 'src/services/Authentication';

type Props = {};

export const TournamentRoute: React.FC<Props> = (props) => {
  const params = useParams<{ slug: string }>();
  const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>();
  const tournamentMocker = new TournamentWithFullDetailsMocker();
  const auth = useAuthentication();

  useEffect(() => {
    if (auth.authenticationType !== 'user') {
      return;
    }
    // getTournamentWithFullDetails({ tournamentId: params.slug }).map((tournament) => {
    //   setTournament(tournament);
    // });
    setTournament(tournamentMocker.withUnderwayGameAndAuthenticatedUser(6, auth.user));
  }, [params.slug, auth]);

  return (
    <Page name="Tournament" stretched>
      {tournament && <TournamentPage tournament={tournament} />}
    </Page>
  );
};
