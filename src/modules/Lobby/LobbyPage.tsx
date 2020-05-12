import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import {
  PublicRoomsResponsePayload,
  PeerRecord,
  RoomStatsRecord,
} from 'dstnd-io';
import { Result } from 'ts-results';
import { SocketConsumer } from 'src/components/SocketProvider';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { createRoom, createChallenge } from 'src/resources';
import { GameRoomContainer } from '../GameRoom/GameRoomContainer';

type Props = {
  getRooms: () => Promise<Result<PublicRoomsResponsePayload, unknown>>;
};

export const LobbyPage: React.FunctionComponent<Props> = (props) => {
  const cls = useStyles();

  // Since there is no AppState like Redux or smtg, I'm going to keep it here
  //  for now, but this isn't the best design!
  const [publicRooms, setPublicRooms] = useState<PublicRoomsResponsePayload>(
    [],
  );
  const [me, setMe] = useState<PeerRecord | void>();
  const [joinedRoom, setJoinedRoom] = useState<RoomStatsRecord | void>();

  useEffect(() => {
    (async () => {
      const res = await props.getRooms();

      res.map(setPublicRooms);
    })();
  }, []);

  if (!publicRooms[0]) {
    return null;
  }

  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'joinRoomSuccess') {
          setMe(msg.content.me);
          setJoinedRoom(msg.content.room);
        } else if (msg.kind === 'roomStats') {
          setJoinedRoom(msg.content);
        } else if (msg.kind === 'connectionOpened') {
          setMe(msg.content.me);
        }
      }}
      onReady={(socket) => {
        socket.send({
          kind: 'joinRoomRequest',
          content: {
            roomId: publicRooms[0].id,
            code: undefined,
          },
        });
      }}
      render={({ send }) => (
        <div className={cls.container}>
          {joinedRoom && me ? (
            <GameRoomContainer
              room={joinedRoom}
              me={me}
            />
          ) : (
            <>
              <div>
                <span>Public Rooms</span>
                {publicRooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() =>
                      send({
                        kind: 'joinRoomRequest',
                        content: {
                          roomId: room.id,
                          code: undefined,
                        },
                      })}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
              {me && (
                <>
                  <div className={cls.box}>
                    <span>Create Open Challenge</span>
                    <ColoredButton
                      label="Create Open Challenge"
                      color="rgb(8, 209, 131)"
                      onClickFunction={async () => {
                        (await createChallenge({ peerId: me.id }))
                          .map((r) => {
                            send({
                              kind: 'joinRoomRequest',
                              content: {
                                roomId: r.id,
                                code: r.type === 'private' ? r.code : undefined,
                              },
                            });
                          });
                      }}
                    />
                  </div>
                  <div className={cls.box}>
                    <span>Play With Friends</span>
                    <ColoredButton
                      label="Create New Room"
                      color="rgb(8, 209, 131)"
                      onClickFunction={async () => {
                        (await createRoom({
                          nickname: undefined,
                          peerId: me.id,
                          type: 'private',
                        }))
                          .map((r) => {
                            send({
                              kind: 'joinRoomRequest',
                              content: {
                                roomId: r.id,
                                code: r.type === 'private' ? r.code : undefined,
                              },
                            });
                          });
                      }}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',
  },
  box: {
    background: '#efefef',
  },

});
