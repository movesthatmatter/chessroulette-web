import React from 'react';
import { ActivityRoomConsumer } from './RoomConsumers/ActivityRoomConsumer';
import { RoomProvider } from './RoomProvider';
import { JoinedRoom } from './types';

type Props = {
  joinedRoom: JoinedRoom;
};

export const Room: React.FC<Props> = (props) => {
  return (
    <RoomProvider joinedRoom={props.joinedRoom}>
      <ActivityRoomConsumer />
    </RoomProvider>
  );
};