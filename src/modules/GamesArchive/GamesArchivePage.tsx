import React, { useEffect, useState } from 'react';
import { AuthenticatedPage } from 'src/components/Page';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { gameRecordToGame } from '../Games/Chess/lib';
import { Game } from '../Games/types';
import { getUserGames } from './resources';
import { GamesArchive } from './GamesArchive';


type Props = {};

export const GamesArchivePage: React.FC<Props> = () => {
  const user = useAuthenticatedUser();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    if (!(user && user.isGuest)) {
      return;
    }

    getUserGames({ userId: user.id }).map((gameRecords) => {
      setGames(gameRecords.map(gameRecordToGame))
    });
  }, [user]);

  return (
    <AuthenticatedPage>
      {user?.isGuest === false && <GamesArchive user={user} games={games} />}
    </AuthenticatedPage>
  );
};
