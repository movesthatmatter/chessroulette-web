import React from 'react';
import { useParams } from 'react-router-dom';
import { JoinRoomBouncer } from './JoinRoomBouncer';
import { RoomContainer } from './RoomContainer';

type Props = {};

export const RoomRoute: React.FC<Props> = () => {
  const params = useParams<{ slug: string }>();

  return (
    <JoinRoomBouncer
      slug={params.slug}
      render={(joinedRoom) => <RoomContainer joinedRoom={joinedRoom} />}
    />
  );
};
