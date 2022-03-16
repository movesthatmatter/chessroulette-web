import React, { useCallback, useEffect } from 'react';
import { useWillUnmount } from 'src/lib/hooks/useWillUnmount';
import { usePeerState } from 'src/providers/PeerProvider';
import { ActivityRoomConsumer } from './RoomConsumers/ActivityRoomConsumer';
import { RoomProvider } from './RoomProvider';
import { JoinedRoom } from './types';

type Props = {
  joinedRoom: JoinedRoom;
};

/**
 * This Room does 2 important things:
 *  - Connects to all the present Peers in the room at mount
 *  - Leaves the room on unmount. This is very important in order to update the hasJoinedRoom flag on the Peer
 */
export const Room: React.FC<Props> = ({ joinedRoom }) => {
  const peerState = usePeerState();

  // Once joined connect to all the peers in the room
  const connectToRoom = useCallback(() => {
    if (peerState.status === 'open' && peerState.hasJoinedRoom && !peerState.connectionAttempt) {
      peerState.connectToRoom();
    }
  }, [peerState]);

  const leaveRoom = useCallback(() => {
    if (peerState.status === 'open' && peerState.hasJoinedRoom) {
      peerState.leaveRoom();
    }
  }, [peerState]);

  // Connect to the Room on Mount
  useEffect(connectToRoom, [connectToRoom]);

  useEffect(() => console.log('joined room => ', joinedRoom), [joinedRoom]);

  // This is very important as the room needs to be updated with the
  useWillUnmount(leaveRoom, [leaveRoom]);

  return (
    <RoomProvider joinedRoom={joinedRoom}>
      <ActivityRoomConsumer />
    </RoomProvider>
  );
};
