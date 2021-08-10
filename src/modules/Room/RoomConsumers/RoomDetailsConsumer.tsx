import React, { useContext } from 'react';
import { RoomDetails } from '../Layouts';
import { RoomProviderContext } from '../RoomProvider';

type Props = {};

export const RoomDetailsConsumer: React.FC<Props> = (props) => {
  const context = useContext(RoomProviderContext);

  if (!context) {
    return null;
  }

  return <RoomDetails room={context.room} />;
};

