import { Resources } from 'chessroulette-io';
// import { ChallongeTournamentRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnchorLink } from 'src/components/AnchorLink';
import { Button } from 'src/components/Button';
import { WithDialog } from 'src/components/Dialog';
import { Page } from 'src/components/Page';
import { RelativeLink } from 'src/components/RelativeLink';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { AsyncResult } from 'ts-async-results';
import { CreateTournamentDialog } from '../components/CreateTournamentDialog/CreateTournamentDialog';
import { createTournament, getAllTournaments } from '../resources';

type Props = {};

type TournamentRecord = Resources.Collections.Tournaments.Records.TournamentRecord;

export const TournamentsPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [allTournaments, setAllTournaments] = useState<TournamentRecord[]>([]);

  useEffect(() => {
    getTournaments();
  }, []);

  function getTournaments() {
    getAllTournaments({
      // state: 'all',
      type: 'swiss',
    }).map(setAllTournaments);
  }

  return (
    <Page name="Tournaments" stretched containerClassname={cls.container}>
      <div className={cls.tournamentContainer}>
        <Text style={{ marginBottom: '20px' }}>Current Tournaments:</Text>
        {allTournaments.map((tournament) => (
          <RelativeLink to={tournament.id} key={tournament.id}>
            <Text>{tournament.name}</Text>
          </RelativeLink>
        ))}
      </div>
    </Page>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    ...makeImportant({
      ...(theme.name === 'lightDefault'
        ? {
            backgroundColor: theme.colors.background,
          }
        : {
            backgroundColor: '#27104e',
            backgroundImage: 'linear-gradient(19deg, #27104e 0%, #161a2b 25%)',
          }),
    }),
  },
  tournamentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
}));
