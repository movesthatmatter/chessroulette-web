import React, { useEffect, useState } from 'react';
import * as roomResources from './resources';
import { RoomRecord } from 'dstnd-io';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { FunWallpaper } from 'src/components/FunWallpaper';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { useSession } from 'src/services/Session';
import { JoinedRoom } from './types';
import { useJoinedRoom } from './hooks/useJoinedRoom';
import { JoinRoomWizard } from './wizards/JoinRoomWizard';
import { AsyncOk } from 'ts-async-results';
import { Peer, ReadyPeerConnection } from 'src/providers/PeerConnectionProvider';
import { useDispatch } from 'react-redux';
import { createRoomAction, updateRoomAction } from './redux/actions';

type Props = {
  readyPeerConnection: ReadyPeerConnection;
  slug: RoomRecord['slug'];
  render: (p: { room: JoinedRoom; peer: Peer }) => React.ReactNode;
};

type SessionState = {
  [roomSlug: string]: {
    canJoin: boolean;
  };
};

export const JoinRoomBouncer: React.FC<Props> = ({ readyPeerConnection: pc, ...props }) => {
  const cls = useStyles();
  const joinedRoom = useJoinedRoom();
  const [roomInfo, setRoomInfo] = useState<RoomRecord>();
  const [session, setSession] = useSession<SessionState>('roomBouncer');
  const dispatch = useDispatch();

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

  // Fetch the Room Info
  useEffect(() => {
    if (roomInfo) {
      // Don't reload the room info if it's already present
      return;
    }

    roomResources.getRoom({ slug: props.slug }).map((roomInfo) => {
      setRoomInfo(roomInfo);
      setSession((prev) => ({
        [roomInfo.slug]: {
          // If I'm the host let me join right away
          canJoin: (prev && prev[roomInfo.slug]?.canJoin) || pc.peer.id === roomInfo.createdBy,
        },
      }));
    });
  }, [props.slug, roomInfo, session]);

  // Join the Room once the canJoin is true
  useEffect(() => {
    if (pc.ready && roomInfo && !pc.peer.hasJoinedRoom && session && session[props.slug]?.canJoin) {
      pc.connection.send({
        kind: 'joinRoomRequest',
        content: {
          roomId: roomInfo.id,
          code: roomInfo.code || undefined,
        },
      });
    }
  }, [roomInfo, pc.ready, session]);

  // Ensure the current joioned room is the same one
  if (joinedRoom?.slug === props.slug) {
    return <>{props.render({ room: joinedRoom, peer: pc.peer })}</>;
  }

  const sessionState = session ? session[props.slug] : undefined;

  if (roomInfo && !sessionState?.canJoin) {
    return (
      <FunWallpaper>
        <div className={cls.container}>
          <div className={cls.box}>
            <JoinRoomWizard
              myUser={pc.peer.user}
              roomInfo={roomInfo}
              onFinished={() => {
                setSession({
                  [props.slug]: {
                    canJoin: true,
                  },
                });

                return AsyncOk.EMPTY;
              }}
            />
          </div>
        </div>
      </FunWallpaper>
    );
  }

  return <AwesomeLoaderPage />;
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    // TODO: This should be the same as the DialogContent
    minWidth: '200px',
    maxWidth: '360px',
    width: '50%',
    display: 'flex',
    background: theme.colors.white,
    ...floatingShadow,
    ...softBorderRadius,
    padding: spacers.large,
  },
}));
