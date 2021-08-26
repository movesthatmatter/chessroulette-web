import React, { useContext } from 'react';
import { StreamingBox, StreamingBoxProps } from 'src/components/StreamingBox';
import { RoomProviderContext } from '../RoomProvider';

type Props = Omit<StreamingBoxProps, 'room'> & {};

export const StreamingBoxRoomConsumer: React.FC<Props> = (props) => {
  const roomContext = useContext(RoomProviderContext);

  if (!roomContext) {
    // Show Loader
    return null;
  }

  return <StreamingBox room={roomContext.room} {...props} />;
};
