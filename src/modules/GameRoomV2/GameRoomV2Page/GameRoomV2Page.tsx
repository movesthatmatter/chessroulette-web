import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Page } from 'src/components/Page/Page';
import { PeerProvider } from 'src/components/PeerProvider';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'src/services/Authentication';
import { GameRoomV2Container } from '../GameRoomV2Container/GameRoomV2Container';

type Props = {};

export const GameRoomV2Page: React.FC<Props> = () => {
  const params = useParams<{id: string; code?: string}>();

  const auth = useSelector(selectAuthentication);

  // If not authenticated with a real user create a temporary Guest

  return (
    <Page>
      <PeerProvider
        roomCredentials={params}
        // userId={auth.isAuthenticated ? auth.user.id :}
        userInfo={auth.isAuthenticated ? auth.user : {
          // Don't hardcode this
          id: '123',
          name: 'asda',
          avatarId: '3',
        }}
      >
        <GameRoomV2Container />
      </PeerProvider>
    </Page>
  );
};
