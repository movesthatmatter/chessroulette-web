import React, { useContext } from 'react';
import { JoinedRoomProviderContext } from '../Providers/JoinedRoomProvider';
import { RoomTabsWidget, RoomTabsWidgetProps } from '../widgets/RoomTabsWidget';

type Props = Omit<RoomTabsWidgetProps, 'me' | 'room'>;

export const RoomTabsWidgetRoomConsumer: React.FC<Props> = (props) => {
  const roomContext = useContext(JoinedRoomProviderContext);

  if (!roomContext) {
    // Add Loader
    return null;
  }

  return <RoomTabsWidget me={roomContext.room.me.user} {...props} room={roomContext.room} />;
};
