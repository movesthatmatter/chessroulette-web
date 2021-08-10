import React, { useContext } from 'react';
import { RoomProviderContext } from '../RoomProvider';
import { RoomTabsWidget, RoomTabsWidgetProps } from '../widgets/RoomTabsWidget';

type Props = Omit<RoomTabsWidgetProps, 'me'>;

export const RoomTabsWidgetRoomConsumer: React.FC<Props> = (props) => {
  const roomContext = useContext(RoomProviderContext);

  if (!roomContext) {
    // Add Loader
    return null;
  }

  return <RoomTabsWidget me={roomContext.room.me.user} {...props} />;
};
