import { RoomRecord } from 'dstnd-io';
import React from 'react';
import { JoinRoomBouncer } from '../Room/Room/JoinRoomBouncer';
import { Room } from './Room';

type Props = {
  roomInfo: RoomRecord;
};

export const RoomRoute: React.FC<Props> = (props) => {
  return (
    <JoinRoomBouncer
      roomInfo={props.roomInfo}
      renderJoinedRoom={() => <Room />}
    />
  );
};
