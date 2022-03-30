import React from 'react';
import { RoomRecord } from 'chessroulette-io';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { usePeerConnection } from 'src/providers/PeerConnectionProvider';
import { JoinedRoomProvider } from './Providers/JoinedRoomProvider';
import { JoinRoomBouncer } from './JoinRoomBouncer';
import { RoomConnectProvider } from './Providers/RoomConnectProvider';
import { ActivityRoomConsumer } from './RoomConsumers/ActivityRoomConsumer';
import { ExitRoomWidgetListener } from './widgets/ExitRoomWidgetListener';

type Props = {
  slug: RoomRecord['slug'];
};

export const RoomPage: React.FC<Props> = (props) => {
  const pc = usePeerConnection();

  if (!pc.ready) {
    if (pc.loading) {
      return <AwesomeLoaderPage />;
    }
    return <AwesomeErrorPage />;
  }

  return (
    <JoinRoomBouncer
      readyPeerConnection={pc}
      slug={props.slug}
      render={({ room, peer }) => (
        <JoinedRoomProvider readyPeerConnection={pc} room={room}>
          <RoomConnectProvider room={room} peer={peer}>
            <ActivityRoomConsumer />
          </RoomConnectProvider>
          <ExitRoomWidgetListener />
        </JoinedRoomProvider>
      )}
    />
  );
};
