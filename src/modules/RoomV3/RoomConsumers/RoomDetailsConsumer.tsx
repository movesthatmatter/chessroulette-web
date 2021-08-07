import React, { useContext } from 'react';
import { RoomDetails } from 'src/modules/Room/Room/components/RoomDetails';
import { RoomProviderContext } from '../RoomProvider';

type Props = {};

export const RoomDetailsConsumer: React.FC<Props> = (props) => {
  const context = useContext(RoomProviderContext);

  if (!context) {
    return null;
  }

  return <RoomDetails room={context.room} />;
};

