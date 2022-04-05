import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Page } from 'src/components/Page';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { useAuthentication } from 'src/services/Authentication';
import { AuthenticationBouncer } from 'src/services/Authentication/widgets';
import { Match } from './components/Match/Match';
import {
  createTournamentParticipant,
  getTournamentWithFullDetails,
  getAllMatches,
} from './resources';
import { TournamentPage } from './TournamentPage/TournamentPage';
import { TournamentMatchRecord, TournamentWithFullDetailsRecord } from './types';

type Props = {};

export const TournamentRoute: React.FC<Props> = (props) => {
  const cls = useStyles();
  const params = useParams<{ slug: string }>();
  const auth = useAuthentication();
  const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>();
  const [matches, setMatches] = useState<TournamentMatchRecord[]>();
  const [iamParticipating, setIamParticipating] = useState<boolean>(false);

  useEffect(() => {
    if (auth.authenticationType !== 'user') {
      return;
    }

    getTournamentWithFullDetails({ tournamentId: params.slug }).map((tournament) => {
      setTournament(tournament);
      setIamParticipating(!!tournament.participants.find((p) => p.user.id === auth.user.id));
    });
  }, [auth]);

  return <Page name="Tournament">{tournament && <TournamentPage tournament={tournament} />}</Page>;
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
});
