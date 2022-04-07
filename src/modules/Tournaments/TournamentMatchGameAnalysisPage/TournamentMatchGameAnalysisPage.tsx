import { TournamentCompleteMatchRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import React from 'react';
import { JoinedRoomProvider } from 'src/modules/Room/Providers/JoinedRoomProvider';
import { RoomConnectProvider } from 'src/modules/Room/Providers/RoomConnectProvider';
import { ActivityRoomConsumer } from 'src/modules/Room/RoomConsumers/ActivityRoomConsumer';
import { PeerToServerConsumer } from 'src/providers/PeerConnectionProvider';
import { useAnyUser } from 'src/services/Authentication';
import { GetRoomOrCreate } from '../room/GetRoomOrCreate';
import { RoomBouncer } from '../room/RoomBouncer';

type Props = {
  match: TournamentCompleteMatchRecord;
};

export const TournamentMatchGameAnalysisPage: React.FC<Props> = ({ match }) => {
  const user = useAnyUser();

  if (!user) {
    return null;
  }

  return (
    <GetRoomOrCreate
      slug={`${match.slug}-${user.id}-analysis`}
      newRoomSpecs={{
        userId: user.id,
        slug: `${match.slug}-${user.id}-analysis`,
        activity: {
          activityType: 'analysis',
          source: 'archivedGame',
          gameId: match.gameId,
        },
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
              renderFallback={() => {
                return <div>cant join</div>;
              }}
            />
          )}
        />
      )}
    />
  );
};
