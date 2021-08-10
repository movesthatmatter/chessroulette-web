import React, { useContext } from 'react';
import { createUseStyles } from 'src/lib/jss';
import {
  RoomTabsWidget,
  RoomTabsWidgetProps,
} from 'src/modules/Room/LayoutProvider/Layouts/Generic/RoomLayout/DesktopRoomLayout/widgets/RoomTabsWidget';
import { RoomProviderContext } from '../RoomProvider';

type Props = Omit<RoomTabsWidgetProps, 'me'>;

export const RoomTabsWidgetRoomConsumer: React.FC<Props> = (props) => {
  const roomContext = useContext(RoomProviderContext);

  if (!roomContext) {
    // Add Loader
    return null;
  }

  return <RoomTabsWidget me={roomContext.room.me.user} {...props} />;
};
