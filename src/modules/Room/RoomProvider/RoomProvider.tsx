import React, { useCallback, useEffect, useState } from 'react';
import { RoomProviderContext, RoomProviderContextState } from './RoomProviderContext';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { useRoomActivityListener } from 'src/modules/Room/RoomActivityLog/useRoomActivityListener';
import { JoinedRoom } from '../types';
import { RoomActivityType } from 'dstnd-io';
import { usePeerState } from 'src/providers/PeerProvider';

type Props = {
  joinedRoom: JoinedRoom;
};

export const RoomProvider: React.FC<Props> = ({ joinedRoom, ...props }) => {
  const deviceSize = useDeviceSize();
  const peerState = usePeerState();

  const switchActivity = useCallback(
    (p: RoomActivityType) => {
      if (peerState.status !== 'open') {
        return;
      }

      if (p === 'analysis') {
        return peerState.client.sendMessage({
          kind: 'switchJoinedRoomActivityRequest',
          content: {
            activityType: 'analysis',
          },
        });
      }

      if (p === 'none') {
        return peerState.client.sendMessage({
          kind: 'switchJoinedRoomActivityRequest',
          content: {
            activityType: 'none',
          },
        });
      }
    },
    [joinedRoom]
  );

  const [contextState, setContextState] = useState<RoomProviderContextState>({
    deviceSize,
    room: joinedRoom,
    roomActions: {
      switchActivity,
    },
  });

  useRoomActivityListener(joinedRoom);

  useEffect(() => {
    setContextState({
      room: joinedRoom,
      deviceSize,
      roomActions: {
        switchActivity,
      },
    });
  }, [joinedRoom, deviceSize, switchActivity]);

  return (
    <RoomProviderContext.Provider value={contextState}>
      {props.children}
    </RoomProviderContext.Provider>
  );
};
