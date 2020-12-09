import { RoomRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { usePeerState } from 'src/components/PeerProvider';
import { Room } from 'src/components/RoomProvider';
import { GenericRoomBouncer, useGenericRoomBouncer } from '../GenericRoomBouncer';
import { GenericRoom } from './GenericRoom';

type Props = {
  roomInfo: RoomRecord;
};

export const GenericRoomPage: React.FC<Props> = ({ roomInfo, ...props }) => {
  const peerState = usePeerState();
  const [room, setRoom] = useState<Room | undefined>(
    peerState.status === 'open' && peerState.hasJoinedRoom ? peerState.room : undefined
  );
  const { state: bouncerState } = useGenericRoomBouncer(true);

  useEffect(() => {
    if (peerState.status !== 'open') {
      // TODO: This I need to check more wether this is the behavior I want
      setRoom(undefined);
      return;
    }

    if (peerState.hasJoinedRoom) {
      setRoom(peerState.room);
    }
  }, [peerState]);

  if (room) {
    return (
      <GenericRoom room={room} />
    );
  }

  // If the user hasn't joined the existent Room yet
  //  make him go through the bouncer and have him join it!
  if (roomInfo && !bouncerState.ready && peerState.status === 'open') {
    return (
      <GenericRoomBouncer
        roomInfo={roomInfo}
        onReady={() => {
          if (peerState.status === 'open') {
            // This call will eventually get a peerState room
            peerState.client.send({
              kind: 'joinRoomRequest',
              content: {
                roomId: roomInfo.id,
                code: roomInfo.code || undefined,
              },
            });
          }
        }}
      />
    );
  }

  // TODO: This could be smarter
  return <AwesomeLoaderPage />;
};