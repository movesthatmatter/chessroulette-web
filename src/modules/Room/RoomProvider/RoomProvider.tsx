import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RoomProviderContext, RoomProviderContextState } from './RoomProviderContext';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { useRoomActivityListener } from 'src/modules/Room/RoomActivityLog/useRoomActivityListener';
import { JoinedRoom } from '../types';
import { RoomActivityCreationRecord, RoomLayout, SwitchRoomLayoutRequestPayload } from 'dstnd-io';
import { usePeerState } from 'src/providers/PeerProvider';
import { Events } from 'src/services/Analytics';
import { BoardOrientation } from 'src/modules/Games';

type Props = {
  joinedRoom: JoinedRoom;
};

export const RoomProvider: React.FC<Props> = ({
  joinedRoom: tempJoinedRoomWithoutLayout,
  ...props
}) => {
  const deviceSize = useDeviceSize();
  const peerState = usePeerState();
  const joinedRoom = useMemo(
    () => ({ ...tempJoinedRoomWithoutLayout }),
    [tempJoinedRoomWithoutLayout]
  );

  // TODO: Once we have Board Settings, this can be moved out of here
  const [boardOrientation, setBoardOrientation] = useState<BoardOrientation>('home');

  const switchActivity = useCallback(
    (content: RoomActivityCreationRecord) => {
      if (peerState.status !== 'open') {
        return;
      }

      Events.trackSwitchedRoomActivity(content.activityType);

      peerState.client.send({
        kind: 'switchJoinedRoomActivityRequest',
        content,
      });
    },
    [peerState.status, joinedRoom]
  );

  const goLive = useCallback(() => {
    if (peerState.status !== 'open') {
      return;
    }

    peerState.client.send({
      kind: 'switchToRelayAndGoLive',
      content: undefined,
    });
  }, [peerState.status, joinedRoom]);

  const switchLayout = useCallback(
    (layout?: RoomLayout) => {
      if (peerState.status !== 'open') {
        return;
      }

      return peerState.client.send({
        kind: 'switchRoomLayoutRequestPayload',
        content: layout,
      });
    },
    [peerState.status, joinedRoom]
  );

  const [contextState, setContextState] = useState<RoomProviderContextState>({
    deviceSize,
    room: joinedRoom,
    roomActions: {
      switchActivity,
      goLive,
      switchLayout,
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
        goLive,
        switchLayout,
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
