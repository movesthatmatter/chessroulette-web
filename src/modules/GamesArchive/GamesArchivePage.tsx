import React, { useEffect, useState } from 'react';
import { AuthenticatedPage } from 'src/components/Page';
import { gameRecordToGame } from '../Games/Chess/lib';
import { Game } from '../Games/types';
import { getMyGames } from './resources';
import { GamesArchive } from './GamesArchive';


type Props = {};

export const GamesArchivePage: React.FC<Props> = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    getMyGames().map((gameRecords) => {
      setGames(gameRecords.map(gameRecordToGame))
    });
  }, []);

  return (
    <AuthenticatedPage
      render={({ user }) => <GamesArchive user={user} games={games} />}
    />
  );
};
