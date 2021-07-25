import React, { useCallback, useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { usePeerState } from 'src/providers/PeerProvider';

type Props = {};

// Connects & Disconnects to all the Peers in the Room on entering and exiting
//  respectively.
// The room is only needed here in order to enforce using it only where
//  there is a room available!
export const RoomConnectionProvider: React.FC<Props> = (props) => {
  const peerState = usePeerState();
  const [connectionAttempt, setConnectionAttempt] = useState(false);

  const connectToRoom = useCallback(() => {
    if (peerState.status === 'open' && peerState.hasJoinedRoom && !connectionAttempt) {
      peerState.connectToRoom();
      setConnectionAttempt(true);
    }
  }, [peerState, connectionAttempt]);

  const leaveRoom = useCallback(() => {
    console.log('leaving', {...peerState});
    if (peerState.status === 'open' && peerState.hasJoinedRoom) {
      peerState.leaveRoom();
    }
  }, [peerState]);

  // Connect to the Room on Mount
  useEffect(connectToRoom, [connectToRoom]);

  // Leave the Room on unmount
  useEffect(() => leaveRoom, []);

  return <>{props.children}</>;
};
