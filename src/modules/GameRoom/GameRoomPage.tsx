import React, { useState } from 'react';
import { RoomStatsRecord, PeerRecord } from 'dstnd-io';
import { useParams } from 'react-router-dom';
import { SocketConsumer } from 'src/components/SocketProvider';
import { GameRoomContainer } from './GameRoomContainer';

type Props = {};

type Errors = 'WrongCode';

export const GameRoomPage: React.FC<Props> = () => {
  const params = useParams<{id: string; code?: string}>();

  const [error, setError] = useState<Errors | undefined>();
  const [me, setMe] = useState<PeerRecord | void>();
  const [joinedRoom, setJoinedRoom] = useState<RoomStatsRecord | void>();

  console.log('params', params);

  if (!('id' in params)) {
    return (
      <div>
        Bad id
      </div>
    );
  }

  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'joinRoomSuccess') {
          setMe(msg.content.me);
          setJoinedRoom(msg.content.room);
        } else if (msg.kind === 'joinRoomFailure') {
          setError('WrongCode');
        }
      }}
      onReady={(socket) => socket.send({
        kind: 'joinRoomRequest',
        content: {
          roomId: params.id,
          code: ('code' in params) ? params.code : 'undefined',
        },
      })}
      render={() => (
        <>
          {joinedRoom && me ? (
            <>
              <GameRoomContainer
                room={joinedRoom}
                me={me}
              />
            </>
          ) : (
            (() => {
              if (error === 'WrongCode') {
                return (
                  <div>Wrong Code</div>
                );
              }

              return (<div>Loading2...</div>);
            })()
          )}
        </>
      )}
    />
  );
};
