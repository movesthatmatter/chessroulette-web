import { RoomRecord } from 'dstnd-io';
import React from 'react';
import { Room } from './Room';
import { JoinRoomBouncer } from './JoinRoomBouncer';

type Props = {
  roomInfo: RoomRecord;
};

export const RoomRoute: React.FC<Props> = (props) => {
  return (
    <JoinRoomBouncer
      roomInfo={props.roomInfo}
      renderJoinedRoom={(joinedRoom) => <Room joinedRoom={joinedRoom} />}
    />
  );
};
