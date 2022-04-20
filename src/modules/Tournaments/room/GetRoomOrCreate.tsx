import React, { useEffect, useState } from 'react';
import { CreateRoomRequest, RoomRecord } from 'chessroulette-io';
import { AwesomeError } from 'src/components/AwesomeError';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { useResource } from 'src/lib/hooks/useResource';
import { Room } from 'src/modules/Room';
import * as roomResources from 'src/modules/Room/resources';
import { usePeerConnection } from 'src/providers/PeerConnectionProvider';

type Props = {
  slug: RoomRecord['slug'];
  newRoomSpecs: CreateRoomRequest;
  render: (roomInfo: RoomRecord) => React.ReactNode;
  onReady?: (r: Room) => void;
};

export const GetRoomOrCreate: React.FC<Props> = (props) => {
  const [roomInfo, setRoomInfo] = useState<RoomRecord>();
  const pc = usePeerConnection();

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

  useEffect(() => {
    if (!pc.ready) {
      return;
    }

    if (
      roomInfo &&
      roomInfo.activity.type === 'analysis' &&
      props.newRoomSpecs.activity.activityType === 'analysis' &&
      props.newRoomSpecs.activity.source === 'relayedGame'
    ) {
      pc.connection.send({
        kind: 'analysisImportRelayedGameRequest',
        content: {
          id: roomInfo.activity.analysisId,
          relayedGameId: props.newRoomSpecs.activity.relayId,
        },
      });
    }
  }, [props.newRoomSpecs.activity.activityType, roomInfo?.id, pc.ready]);

  if (createRoomResource.isLoading || getRoomResource.isLoading) {
    return <AwesomeLoaderPage />;
  }

  if (!roomInfo) {
    return <AwesomeError />;
  }

  return <>{props.render(roomInfo)}</>;
};
