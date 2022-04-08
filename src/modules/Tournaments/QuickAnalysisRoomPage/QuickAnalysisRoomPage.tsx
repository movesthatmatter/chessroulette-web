import React from 'react';
import { CreateAnalysisRecord, RoomRecord } from 'chessroulette-io';
import { JoinedRoomProvider } from 'src/modules/Room/Providers/JoinedRoomProvider';
import { RoomConnectProvider } from 'src/modules/Room/Providers/RoomConnectProvider';
import { ActivityRoomConsumer } from 'src/modules/Room/RoomConsumers/ActivityRoomConsumer';
import { PeerToServerConsumer } from 'src/providers/PeerConnectionProvider';
import { useAnyUser } from 'src/services/Authentication';
import { GetRoomOrCreate } from '../room/GetRoomOrCreate';
import { RoomBouncer } from '../room/RoomBouncer';

type Props = {
  slug: RoomRecord['slug'];
  analysisActivitySpecs: CreateAnalysisRecord;
};

export const QuickAnalysisRoomPage: React.FC<Props> = ({ slug, analysisActivitySpecs }) => {
  const user = useAnyUser();

  if (!user) {
    return null;
  }

  return (
    <GetRoomOrCreate
      slug={slug}
      newRoomSpecs={{
        userId: user.id,
        slug,
        activity: {
          activityType: 'analysis',
          ...analysisActivitySpecs,
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
