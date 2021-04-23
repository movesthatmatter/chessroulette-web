import { RoomRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Page } from 'src/components/Page';
import { usePeerState } from 'src/providers/PeerProvider';
import { Room } from 'src/providers/PeerProvider';
import { GenericRoomBouncer, useGenericRoomBouncer } from '../GenericRoomBouncer';
import { GenericRoom } from './GenericRoom';

type Props = {
  roomInfo: RoomRecord;
};

export const GenericRoomPage: React.FC<Props> = ({ roomInfo }) => {
  const peerState = usePeerState();
  const [room, setRoom] = useState<Room | undefined>(
    peerState.status === 'open' && peerState.hasJoinedRoom ? peerState.room : undefined
  );
  const { state: bouncerState } = useGenericRoomBouncer();
  const history = useHistory();

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

  useEffect(() => {
    if (!bouncerState.ready) {
      return;
    }

    if (peerState.status === 'open') {
      // This call will eventually get a peerState room
      peerState.client.sendMessage({
        kind: 'joinRoomRequest',
        content: {
          roomId: roomInfo.id,
          code: roomInfo.code || undefined,
        },
      });
    }
  }, [bouncerState.ready]);

  if (room) {
    return <GenericRoom room={room} />;
  }

  // If the user hasn't joined the existent Room yet
  //  make him go through the bouncer and have him join it!
  if (roomInfo && !bouncerState.ready) {
    return (
      <Page doNotTrack>
        <GenericRoomBouncer
          roomInfo={roomInfo}
          onCancel={() => history.push('/')}
        >
          <AwesomeLoaderPage />
        </GenericRoomBouncer>
      </Page>
    );
  }

  // TODO: This could be smarter
  return <AwesomeLoaderPage />;
};
