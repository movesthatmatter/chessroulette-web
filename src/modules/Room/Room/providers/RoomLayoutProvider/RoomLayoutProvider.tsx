import React from 'react';
import { RoomActivityComponent } from 'src/modules/Room/Activities/RoomActivity';
import { GenericRoomLayout } from '../../layouts/GenericRoomLayout/GenericRoomLayout';
import { JoinedRoom } from '../../../types';

type Props = {
  joinedRoom: JoinedRoom;
};

export const RoomLayoutProvider: React.FC<Props> = ({ joinedRoom }) => {
  // TODO: This decides what layout to show based on user
  // When we give the User ability to change the layout
  // Here is where that should happen based on some global state!

  return (
    <GenericRoomLayout
      room={joinedRoom}
      renderActivity={(cd) => (
        <RoomActivityComponent
          activity={joinedRoom.currentActivity}
          layout={{
            container: cd.containerDimensions,
            board: {
              height: cd.boardSize,
              width: cd.boardSize,
            },
          }}
        />
      )}
    />
  );
};
