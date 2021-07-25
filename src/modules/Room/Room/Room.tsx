import React from 'react';
import { useRoomActivityListener } from 'src/modules/Room/ActivityLog/useRoomActivityListener';
import { RoomLayoutProvider } from './providers/RoomLayoutProvider';
import { JoinedRoom } from '../types';
import { RoomConnectionProvider } from './providers/RoomConnectionProvider/RoomConnectionProvider';

type Props = {
  joinedRoom: JoinedRoom;
};

export const Room: React.FC<Props> = ({ joinedRoom }) => {
  useRoomActivityListener(joinedRoom);

  return (
    <RoomConnectionProvider>
      <RoomLayoutProvider joinedRoom={joinedRoom} />
    </RoomConnectionProvider>
  );
};
