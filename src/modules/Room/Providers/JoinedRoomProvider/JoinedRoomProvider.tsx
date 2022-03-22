import React, { useCallback, useEffect, useState } from 'react';
import {
  JoinedRoomProviderContext,
  JoinedRoomProviderContextState,
} from './JoinedRoomProviderContext';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { useRoomActivityListener } from 'src/modules/Room/RoomActivityLog/useRoomActivityListener';
import { JoinedRoom } from '../../types';
import { RoomActivityCreationRecord } from 'dstnd-io';
import { Events } from 'src/services/Analytics';
import { BoardOrientation } from 'src/modules/Games';
import { ReadyPeerConnection } from 'src/providers/PeerConnectionProvider';
import { useWillUnmount } from 'src/lib/hooks/useWillUnmount';

type Props = {
  room: JoinedRoom;
  readyPeerConnection: ReadyPeerConnection;
};

export const JoinedRoomProvider: React.FC<Props> = ({
  room,
  readyPeerConnection: pc,
  ...props
}) => {
  const deviceSize = useDeviceSize();

  // TODO: Once we have Board Settings, this can be moved out of here
  const [boardOrientation, setBoardOrientation] = useState<BoardOrientation>('home');

  const switchActivity = useCallback((content: RoomActivityCreationRecord) => {
    Events.trackSwitchedRoomActivity(content.activityType);

    pc.connection.send({
      kind: 'switchJoinedRoomActivityRequest',
      content,
    });
  }, []);

  const goLive = useCallback(() => {
    pc.connection.send({
      kind: 'switchToRelayAndGoLive',
      content: undefined,
    });
  }, []);

  const toggleInMeetup = useCallback((inMeetup: boolean) => {
    pc.connection.send({
      kind: 'toggleRoomInMeetupModeRequest',
      content: inMeetup,
    });
  }, []);

  const [contextState, setContextState] = useState<JoinedRoomProviderContextState>({
    deviceSize,
    room,
    roomActions: {
      switchActivity,
      goLive,
      toggleInMeetup,
    },
    boardOrientation,
    setBoardOrientation,
  });

  useRoomActivityListener(room);

  useEffect(() => {
    setContextState({
      room,
      deviceSize,
      roomActions: {
        switchActivity,
        goLive,
        toggleInMeetup,
      },
      boardOrientation,
      setBoardOrientation,
    });
  }, [room, deviceSize, switchActivity, boardOrientation, setBoardOrientation]);

  useEffect(() => {
    Events.trackRoomJoined(room);
  }, []);

  const leaveRoom = useCallback(() => {
    pc.connection.send({
      kind: 'leaveRoomRequest',
      content: undefined,
    });
  }, []);

  // This is very important as the Peer needs to be kept in sync!
  useWillUnmount(leaveRoom, [leaveRoom]);

  return (
    <JoinedRoomProviderContext.Provider value={contextState}>
      {props.children}
    </JoinedRoomProviderContext.Provider>
  );
};
