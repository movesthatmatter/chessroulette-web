import React, { useState, useEffect, ReactNode } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import {
  PublicRoomsResponsePayload,
  PeerRecord,
  RoomStatsRecord,
  RoomRecord,
} from 'chessroulette-io';
import {
  SocketConsumer,
  SocketConsumerProps,
} from 'src/providers/SocketProvider';
import * as roomResources from 'src/modules/Room/resources';

type Props = Pick<
  SocketConsumerProps,
  'autoDemandConnection'
> & {
  render: (props: { room: RoomRecord; me: PeerRecord }) => ReactNode;
};

export const JoinFirstAvailableRoomHelper: React.FC<Props> = (props) => {
  const [socket, setSocket] = useState<SocketClient | undefined>(undefined);
  // These need to be mocked but it's pretty impossible for now
  const [publicRooms, setPublicRooms] = useState<PublicRoomsResponsePayload>(
    []
  );
  const [joinedRoom, setJoinedRoom] = useState<RoomRecord | undefined>(
    undefined
  );
  const [me, setMe] = useState<PeerRecord | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const res = await roomResources.getPublicRooms();

      res.map(setPublicRooms);
    })();
  }, []);

  useEffect(() => {
    if (socket && !joinedRoom && publicRooms.length > 0) {
      socket.send({
        kind: 'joinRoomRequest',
        content: {
          roomId: publicRooms[0].id,
          code: undefined,
        },
      });
    }
  }, [socket, publicRooms, joinedRoom]);

  return (
    <SocketConsumer
      onReady={setSocket}
      onMessage={(msg) => {
        if (msg.kind === 'joinRoomSuccess') {
          setJoinedRoom(msg.content.room);
          setMe(msg.content.me);
        } else if (msg.kind === 'joinedRoomUpdated') {
          setJoinedRoom(msg.content);
        }
      }}
      autoDemandConnection={props.autoDemandConnection}
      // fallbackRender={
      //   props.fallbackRender ||
      //   (() => (
      //     <div>
      //       No room available:
      //       <ul>
      //         <li>{'Make sure the <SocketProvider /> wraps your component'}</li>
      //         <li>or Check the connection!</li>
      //       </ul>
      //     </div>
      //   ))
      // }
      render={() => (
        <>
          {joinedRoom && me && (
            <>
              {props.render({
                room: joinedRoom,
                me,
              })}
            </>
          )}
        </>
      )}
    />
  );
};
