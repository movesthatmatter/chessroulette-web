import { Resources, RoomRecord } from 'chessroulette-io';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { useResource } from 'src/lib/hooks/useResource';
import { JoinedRoom } from 'src/modules/Room';
import { useJoinedRoom } from 'src/modules/Room/hooks/useJoinedRoom';
import { createRoomAction, updateRoomAction } from 'src/modules/Room/redux/actions';
import { canJoinRoom } from 'src/modules/Room/resources';
import { ReadyPeerToServerConnection } from 'src/providers/PeerConnectionProvider';
import { useAnyUser } from 'src/services/Authentication';
import { AsyncOk, AsyncResult } from 'ts-async-results';

type Props = {
  pc: ReadyPeerToServerConnection;
  room: RoomRecord;
  extraCondition?: (p: {
    room: RoomRecord;
    canJoin: Resources.Collections.Room.CanJoinRoom.OkResponse;
  }) => AsyncResult<Resources.Collections.Room.CanJoinRoom.OkResponse, void>;
  render: (joinedRoom: JoinedRoom) => React.ReactNode;

  // TODO: type this
  renderFallback?: (reason: any) => React.ReactNode;
};

export const RoomBouncer: React.FC<Props> = ({ pc, room, extraCondition, ...props }) => {
  const anyUser = useAnyUser();
  const [canJoin, setCanJoin] = useState(false);
  const joinedRoom = useJoinedRoom();
  const dispatch = useDispatch();

  const canJoinRoomResource = useResource(canJoinRoom);

  useEffect(() => {
    const unsubscribe = pc.connection.onMessage((msg) => {
      if (msg.kind === 'joinRoomSuccess') {
        dispatch(createRoomAction({ room: msg.content.room, me: pc.peer }));
      }
      // TOOD: Look into moving this into anotehr RoomProvider layer
      else if (msg.kind === 'joinedRoomUpdated') {
        dispatch(updateRoomAction({ room: msg.content }));
      } else if (msg.kind === 'joinedRoomAndGameUpdated') {
        dispatch(updateRoomAction({ room: msg.content.room }));
      } else if (msg.kind === 'joinedRoomAndWarGameUpdated') {
        dispatch(updateRoomAction({ room: msg.content.room }));
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!anyUser) {
      return;
    }

    canJoinRoomResource
      .request({ slug: room.slug })
      .flatMap((canJoin) => {
        if (extraCondition) {
          return extraCondition({ room, canJoin });
        }

        return new AsyncOk(canJoin);
      })
      .map((r) => {
        if (r.canJoin) {
          setCanJoin(true);
        }

        // if not do smtg else?
      });
  }, [room.id, anyUser?.id]);

  // Join the Room once the canJoin is true
  useEffect(() => {
    // TODO: All of these checks should happen on the server!
    if (canJoin && pc.ready && !pc.peer.hasJoinedRoom) {
      pc.connection.send({
        kind: 'joinRoomRequest',
        content: {
          roomId: room.id,
          code: room.code || undefined,
        },
      });
    }
  }, [pc.ready, canJoin]);

  if (joinedRoom) {
    return <>{props.render(joinedRoom)}</>;
  }

  if (!canJoin && props.renderFallback) {
    return <>{props.renderFallback({ reason: 'b/c' })}</>;
  }

  // should this beshown??
  return <AwesomeLoaderPage />;
};
