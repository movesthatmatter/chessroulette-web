import React, { useContext } from 'react';
import { RoomDetails } from '../Layouts';
import { JoinedRoomProviderContext } from '../Providers/JoinedRoomProvider';

type Props = {};

export const RoomDetailsConsumer: React.FC<Props> = (props) => {
  const context = useContext(JoinedRoomProviderContext);

  if (!context) {
    return null;
  }

  return <RoomDetails room={context.room} />;
};

