import React, { useContext } from 'react';
import { MobileChatWidget } from 'src/modules/Room/LayoutProvider/Layouts/Generic/RoomLayout/MobileRoomLayout/widgets/MobileChatWidget';
import { RoomProviderContext } from '../RoomProvider';

type Props = {
  containerHeight: number;
};

export const MobileChatWidgetRoomConsumer: React.FC<Props> = (props) => {
  const roomContext = useContext(RoomProviderContext);

  if (!roomContext) {
    // Show Loader
    return null;
  }

  return (
    <MobileChatWidget
      containerHeight={props.containerHeight}
      myUserId={roomContext.room.me.id}
    />
  );
};
