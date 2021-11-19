import React, { useCallback, useEffect, useState } from 'react';
import { RoomProviderContext, RoomProviderContextState } from './RoomProviderContext';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { useRoomActivityListener } from 'src/modules/Room/RoomActivityLog/useRoomActivityListener';
import { JoinedRoom } from '../types';
import { RoomActivityCreationRecord } from 'dstnd-io';
import { usePeerState } from 'src/providers/PeerProvider';
import { Events } from 'src/services/Analytics';
import { BoardOrientation } from 'src/modules/Games';

type Props = {
  joinedRoom: JoinedRoom;
};

export const RoomProvider: React.FC<Props> = ({ joinedRoom, ...props }) => {
  const deviceSize = useDeviceSize();
  const peerState = usePeerState();

  // TODO: Once we have Board Settings, this can be moved out of here
  const [boardOrientation, setBoardOrientation] = useState<BoardOrientation>('home');

  const switchActivity = useCallback(
    (content: RoomActivityCreationRecord) => {
      if (peerState.status !== 'open') {
        return;
      }

      Events.trackSwitchedRoomActivity(content.activityType);

      return peerState.client.send({
        kind: 'switchJoinedRoomActivityRequest',
        content,
      });
    },
    [joinedRoom]
  );

  const [contextState, setContextState] = useState<RoomProviderContextState>({
    deviceSize,
    room: joinedRoom,
    roomActions: {
      switchActivity,
    },
    boardOrientation,
    setBoardOrientation,
  });

  useRoomActivityListener(joinedRoom);

  useEffect(() => {
    setContextState({
      room: joinedRoom,
      deviceSize,
      roomActions: {
        switchActivity,
      },
      boardOrientation,
      setBoardOrientation,
    });
  }, [joinedRoom, deviceSize, switchActivity, boardOrientation, setBoardOrientation]);

  useEffect(() => {
    Events.trackRoomJoined(joinedRoom);
  }, []);

  return (
    <RoomProviderContext.Provider value={contextState}>
      {props.children}
    </RoomProviderContext.Provider>
  );
};  
