import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePeerState } from 'src/providers/PeerProvider';
import { createRoomAction } from '../redux/actions';

type Props = {};

export const RoomProvider: React.FC<Props> = (props) => {
  // const peerConnection = usePeerConnection();
  const peerState = usePeerState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!peerState.ready) {
      return;
    }

    const unsubscribe = peerState.client.onMessage((msg) => {
      if (msg.kind === 'joinRoomSuccess') {
        dispatch(createRoomAction({ room: msg.content.room, me: peerState.me }));
      }
    });

    return unsubscribe;
  }, [peerState.ready]);

  return <>{props.children}</>;
};
