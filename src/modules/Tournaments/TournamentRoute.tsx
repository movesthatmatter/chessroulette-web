import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from 'src/components/Page';
import { getTournamentWithFullDetails } from './resources';
import { TournamentPage } from './TournamentPage/TournamentPage';
import { TournamentWithFullDetailsRecord } from './types';

type Props = {};

export const TournamentRoute: React.FC<Props> = (props) => {
  const params = useParams<{ slug: string }>();
  const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>();

  useEffect(() => {
    getTournamentWithFullDetails({ tournamentId: params.slug }).map((tournament) => {
      setTournament(tournament);
    });
  }, [params.slug]);

  return <Page name="Tournament">{tournament && <TournamentPage tournament={tournament} />}</Page>;
};
