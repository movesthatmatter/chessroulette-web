import { ChallongeTournamentRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Page } from 'src/components/Page';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { console } from 'window-or-global';
import { checkIfUserIsParticipant, createParticipantForTournament, getTournament } from './resources';

type Props = {};

export const TournamentRoute: React.FC<Props> = (props) => {
  const cls = useStyles();
  const params = useParams<{ slug: string }>();
  const [tournament, setTournament] = useState<ChallongeTournamentRecord>();
  const [userAlreadyParticipant, setUserAlreadyParticipant] = useState(false);
  const user = useAuthenticatedUser();

  useEffect(() => {
    getTournament(params.slug).map((result) => {
      setTournament(result.data.tournament as ChallongeTournamentRecord)
    });
  }, []);

  useEffect(() => {
    if (tournament && user) {
      checkIfUserIsParticipant({
        userId : user.id,
        tournamentId: tournament.id.toString()
      })
      .map(({result}) => setUserAlreadyParticipant(result))
    }
  },[tournament, user])

  function joinTournament() {
    if (!user) {
      console.log('AUTHENTICATE!!')
      return;
    }
    if (tournament?.url) {
      createParticipantForTournament({
        tournamentURL: tournament.url,
        tournamentId: tournament.id,
        userID: user.id,
        misc: user.id,
        name: user.name,
      })
      .map((result) => {
        console.log('Successful Joined')
      })
      .mapErr((e) => {
        console.log('eRROR joining tournament',e)
      })
    }
  }

  return (
    <Page name={`Tournament : ${tournament?.name}`} stretched>
      <div className={cls.container}>
        <Text>Current Tournament: {tournament?.name}</Text>
        <Text>Participants: {tournament?.participants_count}</Text>
        <br/>
        {userAlreadyParticipant && <Text>You already participate!</Text>}
        <Button type="primary" label="Join" onClick={() => joinTournament()} 
        disabled={userAlreadyParticipant}/>
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
