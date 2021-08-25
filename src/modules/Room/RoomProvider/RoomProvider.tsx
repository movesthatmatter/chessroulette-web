import React, { useEffect, useState } from 'react';
import { RoomProviderContext, RoomProviderContextState } from './RoomProviderContext';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { useRoomActivityListener } from 'src/modules/Room/RoomActivityLog/useRoomActivityListener';
import { JoinedRoom } from '../types';

type Props = {
  joinedRoom: JoinedRoom;
};

export const RoomProvider: React.FC<Props> = ({ joinedRoom, ...props }) => {
  const deviceSize = useDeviceSize();
  const [contextState, setContextState] = useState<RoomProviderContextState>({
    deviceSize,
    room: joinedRoom,
  });

  useRoomActivityListener(joinedRoom);

  useEffect(() => {
    setContextState({
      room: joinedRoom,
      deviceSize,
    });
  }, [joinedRoom, deviceSize]);

  return (
    <RoomProviderContext.Provider value={contextState}>
      {props.children}
    </RoomProviderContext.Provider>
  );
};
