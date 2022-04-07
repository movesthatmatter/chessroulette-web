import React, { useMemo } from 'react';
import { TournamentInProgressMatchRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { Page } from 'src/components/Page';
import { JoinedRoomProvider } from 'src/modules/Room/Providers/JoinedRoomProvider';
import { RoomConnectProvider } from 'src/modules/Room/Providers/RoomConnectProvider';
import { ActivityRoomConsumer } from 'src/modules/Room/RoomConsumers/ActivityRoomConsumer';
import { PeerToServerConsumer } from 'src/providers/PeerConnectionProvider';
import { useAnyUser } from 'src/services/Authentication';
import { GetRoomOrCreate } from '../room/GetRoomOrCreate';
import { RoomBouncer } from '../room/RoomBouncer';
import { isUserAMatchParticipant } from '../utils';

type Props = {
  match: TournamentInProgressMatchRecord;
};

export const TournamentInProgressMatchPage: React.FC<Props> = ({ match }) => {
  const user = useAnyUser();
  const iamParticipant = useMemo(() => isUserAMatchParticipant(match, user?.id || ''), [match]);

  if (!user) {
    return <AwesomeErrorPage />;
  }

  if (iamParticipant) {
    return (
      <GetRoomOrCreate
        slug={match.slug}
        newRoomSpecs={{
          // TODO: This should be created by the tournament organizer user id I believe!
          userId: user.id,
          slug: match.slug,
          activity: {
            activityType: 'play',
            creationRecord: 'game',
            gameId: match.gameId,
          },

          // Just for now
          p2pCommunicationType: 'none',
        }}
        render={(room) => (
          <PeerToServerConsumer
            renderReadyConnection={(pc) => (
              <RoomBouncer
                pc={pc}
                room={room}
                render={(room) => (
                  <JoinedRoomProvider readyPeerConnection={pc} room={room}>
                    <RoomConnectProvider room={room} peer={pc.peer}>
                      <ActivityRoomConsumer />
                    </RoomConnectProvider>
                  </JoinedRoomProvider>
                )}
              />
            )}
          />
        )}
      />
    );
  }

  return (
    <Page name="Tournament Match">
      <pre>{JSON.stringify(match, null, 2)}</pre>
    </Page>
  );
};
