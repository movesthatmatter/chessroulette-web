import React, { useEffect, useState } from 'react';
import { RoomProviderContext, RoomProviderContextState } from './RoomProviderContext';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { useJoinedRoom } from '../hooks/useJoinedRoom';
import { useRoomActivityListener } from 'src/modules/Room/RoomActivityLog/useRoomActivityListener';

type Props = {};

export const RoomProvider: React.FC<Props> = (props) => {
  const [contextState, setContextState] = useState<RoomProviderContextState>(undefined);
  const joinedRoom = useJoinedRoom();
  const deviceSize = useDeviceSize();

  useRoomActivityListener(joinedRoom);

  useEffect(() => {
    setContextState(joinedRoom ? { 
      room: joinedRoom,
      deviceSize,
    } : undefined);
  }, [joinedRoom, deviceSize]);

  return (
    <RoomProviderContext.Provider value={contextState}>
      {props.children}
    </RoomProviderContext.Provider>
  );
};
