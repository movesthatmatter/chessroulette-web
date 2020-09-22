import React from 'react';
import { Page } from 'src/components/Page/Page';
import { PeerProvider } from 'src/components/PeerProvider';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'src/services/Authentication';
import { GenericRoom } from './GenericRoom';

type Props = {};

export const GenericRoomPage: React.FC<Props> = () => {
  const params = useParams<{ id: string; code?: string }>();

  const auth = useSelector(selectAuthentication);

  // If not authenticated with a real user create a temporary Guest
  if (auth.authenticationType === 'none') {
    return null;
  }

  return (
    <Page>
      <PeerProvider roomCredentials={params} user={auth.user}>
        <GenericRoom />
      </PeerProvider>
    </Page>
  );
};
