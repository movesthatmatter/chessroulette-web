import React, { useCallback, useEffect, useState } from 'react';
import {
  JoinedRoomProviderContext,
  JoinedRoomProviderContextState,
} from './JoinedRoomProviderContext';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { useRoomActivityListener } from 'src/modules/Room/RoomActivityLog/useRoomActivityListener';
import { JoinedRoom } from '../types';
import { RoomActivityCreationRecord } from 'dstnd-io';
import { Events } from 'src/services/Analytics';
import { BoardOrientation } from 'src/modules/Games';
import { usePeerConnection } from 'src/providers/PeerConnectionProvider';
import { RoomConnectProvider } from '../RoomConnectProvider';

type Props = {
  joinedRoom: JoinedRoom;
};

export const JoinedRoomProvider: React.FC<Props> = ({ joinedRoom, ...props }) => {
  const deviceSize = useDeviceSize();
  const pc = usePeerConnection();

  // TODO: Once we have Board Settings, this can be moved out of here
  const [boardOrientation, setBoardOrientation] = useState<BoardOrientation>('home');

  const switchActivity = useCallback(
    (content: RoomActivityCreationRecord) => {
      if (!pc.ready) {
        return;
      }

      Events.trackSwitchedRoomActivity(content.activityType);

      pc.connection.send({
        kind: 'switchJoinedRoomActivityRequest',
        content,
      });
    },
    [pc.ready, joinedRoom]
  );

  const goLive = useCallback(() => {
    if (!pc.ready) {
      return;
    }

    pc.connection.send({
      kind: 'switchToRelayAndGoLive',
      content: undefined,
    });
  }, [pc.ready, joinedRoom]);

  const toggleInMeetup = useCallback(
    (inMeetup: boolean) => {
      if (!pc.ready) {
        return;
      }

      return pc.connection.send({
        kind: 'toggleRoomInMeetupModeRequest',
        content: inMeetup,
      });
    },
    [pc.ready, joinedRoom]
  );

  const [contextState, setContextState] = useState<JoinedRoomProviderContextState>({
    deviceSize,
    room: joinedRoom,
    roomActions: {
      switchActivity,
      goLive,
      toggleInMeetup,
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
        toggleInMeetup,
      },
      boardOrientation,
      setBoardOrientation,
    });
  }, [joinedRoom, deviceSize, switchActivity, boardOrientation, setBoardOrientation]);

  useEffect(() => {
    Events.trackRoomJoined(joinedRoom);
  }, []);

  // TODO: This could be done better so we don't have an extra check here!
  if (!pc.ready) {
    return null;
  }

  return (
    <RoomConnectProvider room={joinedRoom} peer={pc.peer}>
      <JoinedRoomProviderContext.Provider value={contextState}>
        {props.children}
      </JoinedRoomProviderContext.Provider>
    </RoomConnectProvider>
  );
};
