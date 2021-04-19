import React from 'react';
import { AuthenticatedPage, Page } from 'src/components/Page';
import { GamesArchive } from './GamesArchive';

type Props = {};

export const GamesArchivePage: React.FC<Props> = () => {
  // This doesn't have to be the authenticated 
  //  As someone could potentially see other users games archives
  return <AuthenticatedPage render={({ user }) => <GamesArchive userId={user.id} />} />;
};
