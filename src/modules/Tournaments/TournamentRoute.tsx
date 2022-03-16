import {
  ChallongeMatchRecord,
  ChallongeTournamentRecord,
} from 'dstnd-io/dist/resourceCollections/tournaments/records';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Page } from 'src/components/Page';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { console } from 'window-or-global';
import { Match } from './components/Match/Match';
import {
  checkIfUserIsParticipant,
  createParticipantForTournament,
  getAllMatches,
  getTournament,
} from './resources';
import { determineParticipatingColor } from './utils';

type Props = {};

export const TournamentRoute: React.FC<Props> = (props) => {
  const cls = useStyles();
  const params = useParams<{ slug: string }>();
  const [tournament, setTournament] = useState<ChallongeTournamentRecord>();
  const [userAlreadyParticipant, setUserAlreadyParticipant] = useState(false);
  const user = useAuthenticatedUser();
  const [matches, setMatches] = useState<ChallongeMatchRecord[]>();
  const [userParticipantId, setUserParticipantId] = useState<string | null>(null);

  useEffect(() => {
    getTournament(params.slug, { include_participants: 1 }).map(({ tournament }) => {
      setTournament(tournament as ChallongeTournamentRecord);
      if (tournament.participants && tournament.participants.length > 0) {
        tournament.participants.forEach(({ participant }) => {
          if (participant.misc === user?.id) {
            setUserParticipantId(participant.id.toString());
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (tournament && user) {
      checkIfUserIsParticipant({
        userId: user.id,
        tournamentId: tournament.id.toString(),
      }).map(({ result }) => setUserAlreadyParticipant(result));
    }
  }, [tournament, user]);

  useEffect(() => {
    if (tournament) {
      getAllMatches({ tournamentId: tournament.id.toString() }).map((matches) =>
        setMatches(matches.map((m) => m.match))
      );
    }
  }, [tournament]);

  function joinTournament() {
    if (!user) {
      console.log('AUTHENTICATE!!');
      return;
    }
    if (tournament?.url) {
      createParticipantForTournament({
        tournamentURL: tournament.url,
        tournamentId: tournament.id,
        userId: user.id,
        misc: user.id,
        name: user.name,
      })
        .map((result) => {
          console.log('Successful Joined');
        })
        .mapErr((e) => {
          console.log('eRROR joining tournament', e);
        });
    }
  }

  return (
    <Page name={`Tournament : ${tournament?.name}`} stretched>
      <div className={cls.container}>
        <Text>Current Tournament: {tournament?.name}</Text>
        <Text>Participants: {tournament?.participants_count}</Text>
        <br />
        {userAlreadyParticipant && <Text>You already participate!</Text>}
        <Button
          type="primary"
          label="Join"
          onClick={() => joinTournament()}
          disabled={userAlreadyParticipant}
        />
        <br />
        <Text>Matches :</Text>
        <div className={cls.container}>
          {matches &&
            matches.map((match) => (
              <Match
                match={match}
                participating={determineParticipatingColor(match, userParticipantId)}
              />
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
