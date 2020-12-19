import React from 'react';
import { Room, RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { PlayRoomPage } from 'src/modules/Rooms/PlayRoom/PlayRoom';

type Props = {
  room: Room;
};

export const GenericRoom: React.FC<Props> = ({ room }) => {
  // This only support Play Rooms for now!
  if (room.activity.type === 'play') {
    return  <PlayRoomPage room={room as RoomWithPlayActivity} />;
  }

  return null;
};
