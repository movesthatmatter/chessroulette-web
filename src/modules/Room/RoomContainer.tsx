import React, { useCallback, useEffect, useState } from 'react';
import { useWillUnmount } from 'src/lib/hooks/useWillUnmount';
import { usePeerState } from 'src/providers/PeerProvider';
import { Room } from './Room';
import { JoinedRoom } from './types';

type Props = {
  joinedRoom: JoinedRoom;
};

/**
 * This Container does 2 important things:
 *  - Connects to all the present Peers in the room at mount
 *  - Leaves the room on unmount. This is very important in order to update the hasJoinedRoom flag on the Peer
 */
export const RoomContainer: React.FC<Props> = ({ joinedRoom }) => {
  const peerState = usePeerState();
  const [connectionAttempt, setConnectionAttempt] = useState(false);

  // Once joined connect to all the peers in the room
  const connectToRoom = useCallback(() => {
    if (peerState.status === 'open' && peerState.hasJoinedRoom && !connectionAttempt) {
      peerState.connectToRoom();
      setConnectionAttempt(true);
    }
  }, [peerState, connectionAttempt]);

  // Connect to the Room on Mount
  useEffect(connectToRoom, [connectToRoom]);

  // This is very important as the room needs to be updated with the
  useWillUnmount(() => {
    if (peerState.status === 'open' && peerState.hasJoinedRoom) {
      peerState.leaveRoom();
    }
  });

  return <Room joinedRoom={joinedRoom} />;
};
