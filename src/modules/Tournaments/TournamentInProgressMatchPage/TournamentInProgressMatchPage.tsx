import { TournamentInProgressMatchRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import React, { useEffect, useState } from 'react';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Page } from 'src/components/Page';
import { useResource } from 'src/lib/hooks/useResource';
import { JoinedRoomProvider } from 'src/modules/Room/Providers/JoinedRoomProvider';
import { RoomConnectProvider } from 'src/modules/Room/Providers/RoomConnectProvider';
import { canJoinRoom } from 'src/modules/Room/resources';
import { ActivityRoomConsumer } from 'src/modules/Room/RoomConsumers/ActivityRoomConsumer';
import { PeerToServerConsumer } from 'src/providers/PeerConnectionProvider';
import { useAnyUser } from 'src/services/Authentication';
import { GetRoomOrCreate } from '../room/GetRoomOrCreate';
import { RoomBouncer } from '../room/RoomBouncer';

type Props = {
  match: TournamentInProgressMatchRecord;
};

export const TournamentInProgressMatchPage: React.FC<Props> = ({ match }) => {
  const user = useAnyUser();
  const [canJoinRoomState, setCanJoinRoomState] = useState(false);

  const canJoinRoomResource = useResource(canJoinRoom);

  useEffect(() => {
    canJoinRoomResource.request({ slug: match.slug }).map(({ canJoin }) => {
      setCanJoinRoomState(canJoin);
    });
  }, []);

  if (!user) {
    return null;
  }

  if (canJoinRoomResource.isLoading) {
    // TODO: This should be better
    return <AwesomeLoaderPage />;
  }

  if (canJoinRoomState) {
    return (
      <GetRoomOrCreate
        slug={match.slug}
        newRoomSpecs={{
          // TODO: This should be created by the tournament organizer suer id I believe!
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
                // render={(room) => <pre>{JSON.stringify(room, null, 2)}</pre>}
                render={(room) => (
                  <JoinedRoomProvider readyPeerConnection={pc} room={room}>
                    <RoomConnectProvider room={room} peer={pc.peer}>
                      <ActivityRoomConsumer />
                    </RoomConnectProvider>
                    {/* <ExitRoomWidgetListener /> */}
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
