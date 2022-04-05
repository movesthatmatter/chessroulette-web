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

  return (
    <Page name={`Tournament : ${tournament?.name}`} stretched>
      <div className={cls.container}>
        <Text>Current Tournament: {tournament?.name}</Text>
        <Text>Participants: {tournament?.participantsCount}</Text>
        <br />
        {iamParticipating && <Text>You participating!</Text>}
        {tournament?.state === 'pending' && (
          <AuthenticationBouncer
            onAuthenticated={({ user }) => {
              createTournamentParticipant({
                tournamentId: tournament.id,
              }).map(() => setIamParticipating(true));
            }}
            render={({ check }) => (
              <Button type="primary" label="Join" onClick={check} disabled={iamParticipating} />
            )}
          />
        )}
        <br />
        <Text>Matches :</Text>
        <div className={cls.container}>
          {tournament?.matches.map((match) => (
            <Match match={match} participating={iamParticipating} />
          ))}
        </div>
      </div>
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
});
