import React from 'react';
import { TournamentInProgressMatchRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { JoinedRoomProvider } from 'src/modules/Room/Providers/JoinedRoomProvider';
import { RoomConnectProvider } from 'src/modules/Room/Providers/RoomConnectProvider';
import { ActivityRoomConsumer } from 'src/modules/Room/RoomConsumers/ActivityRoomConsumer';
import { PeerToServerConsumer } from 'src/providers/PeerConnectionProvider';
import { GetRoomOrCreate } from '../room/GetRoomOrCreate';
import { RoomBouncer } from '../room/RoomBouncer';
import { UserRecord } from 'chessroulette-io';

type Props = {
  match: TournamentInProgressMatchRecord;
  meAsParticipant: UserRecord;
};

export const PageAsParticipant: React.FC<Props> = ({ match, meAsParticipant }) => {
  return (
    <GetRoomOrCreate
      slug={match.slug}
      newRoomSpecs={{
        // TODO: This should be created by the tournament organizer user id I believe!
        userId: meAsParticipant.id,
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
                <JoinedRoomProvider
                  readyPeerConnection={pc}
                  room={room}
                  roomOptions={{
                    showActions: false,
                  }}
                >
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
};
