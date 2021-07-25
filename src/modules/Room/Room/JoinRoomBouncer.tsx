import { RoomRecord } from 'dstnd-io';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { usePeerState } from 'src/providers/PeerProvider';
import { RoomBouncer, useRoomBouncer } from '../Bouncer';
import { JoinedRoom } from '../types';
import { useJoinedRoom } from '../hooks/useJoinedRoom';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';

type Props = {
  roomInfo: RoomRecord;
  renderJoinedRoom: (r: JoinedRoom) => React.ReactNode;
};

export const JoinRoomBouncer: React.FC<Props> = ({ roomInfo, renderJoinedRoom }) => {
  const peerState = usePeerState();
  const joinedRoom = useJoinedRoom();
  const { state: bouncerState } = useRoomBouncer(roomInfo.slug);
  const history = useHistory();

  useEffect(() => {
    if (!bouncerState?.ready) {
      return;
    }

    if (peerState.status === 'open' && !peerState.hasJoinedRoom) {
      peerState.joinRoom({
        id: roomInfo.id,
        code: roomInfo.code || undefined,
      });
    }
  }, [bouncerState?.ready, peerState.status]);

  if (joinedRoom) {
    return (
      <RoomBouncer roomInfo={roomInfo} onCancel={() => history.push('/')}>
        {renderJoinedRoom(joinedRoom)}
        {/* <GenericRoomContainer room={room} /> */}
      </RoomBouncer>
    );
  }

  // If the user hasn't joined the existent Room yet
  //  make him go through the bouncer and have him join it!
  if (roomInfo && !bouncerState?.ready) {
    return <RoomBouncer roomInfo={roomInfo} onCancel={() => history.push('/')} />;
  }

  return <AwesomeLoaderPage />;
};
