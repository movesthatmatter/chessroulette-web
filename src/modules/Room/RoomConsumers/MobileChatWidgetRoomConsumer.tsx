import React, { useContext } from 'react';
import { RoomProviderContext } from '../RoomProvider';
import { MobileChatWidget } from '../widgets/MobileChatWidget';

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
