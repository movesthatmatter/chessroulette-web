import React from 'react';
import { Page } from 'src/components/Page/Page';
import { PeerProvider } from 'src/components/PeerProvider';
import { useParams } from 'react-router-dom';
import { GenericRoom } from './GenericRoom';

type Props = {};

export const GenericRoomPage: React.FC<Props> = () => {
  const params = useParams<{ id: string; code?: string }>();

  return (
    <Page>
      <GenericRoom roomCredentials={params} />
    </Page>
  );
};
