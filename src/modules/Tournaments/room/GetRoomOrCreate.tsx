import { CreateRoomRequest, RoomRecord } from 'chessroulette-io';
import React, { useEffect, useState } from 'react';
import { AwesomeError } from 'src/components/AwesomeError';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { useResource } from 'src/lib/hooks/useResource';
import * as roomResources from 'src/modules/Room/resources';

type Props = {
  slug: RoomRecord['slug'];
  newRoomSpecs: CreateRoomRequest;
  render: (roomInfo: RoomRecord) => React.ReactNode;
};

export const GetRoomOrCreate: React.FC<Props> = (props) => {
  const [roomInfo, setRoomInfo] = useState<RoomRecord>();

  const createRoomResource = useResource(roomResources.createRoom);
  const getRoomResource = useResource(roomResources.getRoom);

  // Fetch the Room Info
  useEffect(() => {
    if (roomInfo) {
      // Don't reload the room info if it's already present
      return;
    }

    getRoomResource
      .request({ slug: props.slug })
      .map(setRoomInfo)
      .mapErr((e) => {
        if (e.type === 'ResourceInexistent') {
          createRoomResource.request(props.newRoomSpecs).map(setRoomInfo);
        }
      });
  }, [props.slug, roomInfo]);

  if (createRoomResource.isLoading || getRoomResource.isLoading) {
    return <AwesomeLoaderPage />
  }

  if (!roomInfo) {
    return <AwesomeError />
  }

  return <>{props.render(roomInfo)}</>;
};
