import React, { useEffect, useState } from 'react';
import { RoomRecord } from 'dstnd-io';
import { useJoinedRoom } from 'src/modules/Room/hooks/useJoinedRoom';
import { RoomProviderContext, RoomProviderContextState } from './RoomProviderContext';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';

type Props = {};

export const RoomProvider: React.FC<Props> = (props) => {
  const [contextState, setContextState] = useState<RoomProviderContextState>(undefined);
  const joinedRoom = useJoinedRoom();
  const deviceSize = useDeviceSize();

  useEffect(() => {
    setContextState(joinedRoom ? { 
      room: joinedRoom,
      deviceSize,
    } : undefined);
  }, [joinedRoom, deviceSize]);

  console.log('[RoomV3] RoomProvider renders');

  return (
    <RoomProviderContext.Provider value={contextState}>
      {props.children}
    </RoomProviderContext.Provider>
  );
};
