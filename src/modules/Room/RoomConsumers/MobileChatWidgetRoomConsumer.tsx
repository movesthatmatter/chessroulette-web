import React, { useContext } from 'react';
import { JoinedRoomProviderContext } from '../JoinedRoomProvider';
import { MobileChatWidget } from '../widgets/MobileChatWidget';

type Props = {
  containerHeight: number;
};

export const MobileChatWidgetRoomConsumer: React.FC<Props> = (props) => {
  const roomContext = useContext(JoinedRoomProviderContext);

  if (!roomContext) {
    // Show Loader
    return null;
  }

  return (
    <MobileChatWidget
      containerHeight={props.containerHeight}
      myUserId={roomContext.room.me.id}
      room={roomContext.room}
    />
  );
};
