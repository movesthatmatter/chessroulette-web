import React from 'react';
import { ActivityRoomConsumer } from './RoomConsumers/ActivityRoomConsumer';
import { RoomProvider } from './RoomProvider';

type Props = {};

export const Room: React.FC<Props> = () => {
  return (
    <RoomProvider>
      <ActivityRoomConsumer />
    </RoomProvider>
  );
};