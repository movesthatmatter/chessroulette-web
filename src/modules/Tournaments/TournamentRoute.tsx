import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Page } from 'src/components/Page';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { AuthenticationBouncer } from 'src/services/Authentication/widgets';
import { Match } from './components/Match/Match';
import {
  checkIfUserIsParticipant,
  createTournamentParticipant,
  getTournamentWithFullDetails,
  getAllMatches,
} from './resources';
import { TournamentMatchRecord, TournamentRecord } from './types';

type Props = {};

export const TournamentRoute: React.FC<Props> = (props) => {
  const cls = useStyles();
  const params = useParams<{ slug: string }>();
  const user = useAuthenticatedUser();
  const [tournament, setTournament] = useState<TournamentRecord>();
  const [matches, setMatches] = useState<TournamentMatchRecord[]>();
  const [iamParticipating, setIamParticipating] = useState<boolean>(false);

  useEffect(() => {
    getTournamentWithFullDetails({ tournamentId: params.slug }).map((tournament) => {
      setTournament(tournament);
      setIamParticipating(!!tournament.participants.find((p) => p.user.id === user?.id));
    });
  }, [user?.id]);

  useEffect(() => {
    if (tournament && user) {
      checkIfUserIsParticipant({
        userId: user.id,
        tournamentId: tournament.id,
      }).map(setIamParticipating);
    }
  }, [tournament?.id, user?.id]);

  useEffect(() => {
    if (tournament) {
      getAllMatches({ tournamentId: tournament.id }).map(setMatches);
    }
  }, [tournament?.id]);

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
                userId: user.id,
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
          {matches &&
            matches.map((match) => <Match match={match} participating={iamParticipating} />)}
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
