import React from 'react';
import { useParams } from 'react-router-dom';
import { JoinRoomBouncer } from './JoinRoomBouncer';
import { Room } from './Room';
import { RoomProvider } from './RoomProvider';

type Props = {};

export const RoomRoute: React.FC<Props> = () => {
  const params = useParams<{ slug: string }>();

  return (
    <RoomProvider>
      <JoinRoomBouncer
        slug={params.slug}
        render={(joinedRoom) => <Room joinedRoom={joinedRoom} />}
      />
    </RoomProvider>
  );
};
