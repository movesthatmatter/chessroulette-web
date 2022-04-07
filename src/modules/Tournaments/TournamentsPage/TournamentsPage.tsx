import { Resources } from 'chessroulette-io';
import React, { useEffect, useState } from 'react';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Page } from 'src/components/Page';
import { RelativeLink } from 'src/components/RelativeLink';
import { Text } from 'src/components/Text';
import { useResource } from 'src/lib/hooks/useResource';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { getAllTournaments } from '../resources';

type Props = {};

type TournamentRecord = Resources.Collections.Tournaments.Records.TournamentRecord;

export const TournamentsPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [allTournaments, setAllTournaments] = useState<TournamentRecord[]>([]);

  const getTournamentResource = useResource(getAllTournaments);

  useEffect(() => {
    getTournamentResource.request().map(setAllTournaments);
  }, []);

  if (getTournamentResource.isLoading) {
    return <AwesomeLoaderPage />;
  }

  return (
    <Page name="Tournaments" containerClassname={cls.container}>
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
