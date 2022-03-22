import React from 'react';
import { Peer } from 'src/providers/PeerProvider';
import { JoinedRoomProvider } from './JoinedRoomProvider/JoinedRoomProvider';
import { ActivityRoomConsumer } from './RoomConsumers/ActivityRoomConsumer';
import { JoinedRoom } from './types';

type Props = {
  joinedRoom: JoinedRoom;
  peer: Peer;
};

export const Room: React.FC<Props> = ({ joinedRoom, peer }) => {
  return (
    <JoinedRoomProvider joinedRoom={joinedRoom}>
      <ActivityRoomConsumer />
    </JoinedRoomProvider>
  );
};
