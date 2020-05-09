import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import {
  PublicRoomsResponsePayload,
  PeerRecord,
  RoomStatsRecord,
} from 'dstnd-io';
import { Result } from 'ts-results';
import { SocketConsumer } from 'src/components/SocketProvider';
import { GameRoomContainer } from '../GameRoom/GameRoomContainer';

type Props = {
  getRooms: () => Promise<Result<PublicRoomsResponsePayload, unknown>>;
};

export const LobbyPage: React.FunctionComponent<Props> = (props) => {
  const cls = useStyles();

  // Since there is no AppState like Redux or smtg, I'm going to keep it here
  //  for now, but this isn't the best design!
  const [publicRooms, setPublicRooms] = useState<PublicRoomsResponsePayload>([]);
  const [me, setMe] = useState<PeerRecord | void>(undefined);
  const [myRoom, setMyRoom] = useState<RoomStatsRecord | void>();

  useEffect(() => {
    (async () => {
      const res = await props.getRooms();

      res.map(setPublicRooms);
    })();
  }, []);

  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'joinRoomSuccess') {
          setMe(msg.content.me);
          setMyRoom(msg.content.room);
        }
      }}
      render={({ send }) => (
        <div className={cls.container}>
          {(myRoom && me) ? (
            <GameRoomContainer
              room={myRoom}
              me={me}
            />
          ) : (
            <>
              {publicRooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => send({
                    kind: 'joinRoomRequest',
                    content: { roomId: room.id },
                  })}
                >
                  {room.name}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
});
