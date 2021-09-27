import { RoomRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { FunWallpaper } from 'src/components/FunWallpaper';
import { createUseStyles } from 'src/lib/jss';
import { usePeerState } from 'src/providers/PeerProvider';
import { CustomTheme, floatingShadow, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { useSession } from 'src/services/Session';
import { JoinedRoom } from './types';
import { useJoinedRoom } from './hooks/useJoinedRoom';
import { JoinRoomWizard } from './wizards/JoinRoomWizard';
import * as roomResources from './resources';
import { AsyncOk } from 'ts-async-results';

type Props = {
  slug: RoomRecord['slug'];
  render: (r: JoinedRoom) => React.ReactNode;
};

type SessionState = {
  [roomSlug: string]: {
    canJoin: boolean;
  };
};

export const JoinRoomBouncer: React.FC<Props> = (props) => {
  const cls = useStyles();
  const peerState = usePeerState();
  const joinedRoom = useJoinedRoom();
  const [roomInfo, setRoomInfo] = useState<RoomRecord>();
  const [session, setSession] = useSession<SessionState>('roomBouncer');

  // Fetch the Room Info
  useEffect(() => {
    if (peerState.status !== 'open') {
      return;
    }

    if (roomInfo) {
      // Don't reload the room info if it's already present
      return;
    }

    roomResources.getRoomBySlug(props.slug).map((roomInfo) => {
      setRoomInfo(roomInfo);
      setSession((prev) => ({
        [roomInfo.slug]: {
          // If I'm the host let me join right away
          canJoin: (prev && prev[roomInfo.slug]?.canJoin) || peerState.me.id === roomInfo.createdBy,
        },
      }));
    });
  }, [props.slug, peerState.status, roomInfo, session]);

  // Join the Room once the canJoin is true
  useEffect(() => {
    if (
      peerState.status === 'open' &&
      roomInfo &&
      !peerState.hasJoinedRoom &&
      session &&
      session[props.slug]?.canJoin
    ) {
      peerState.joinRoom({
        id: roomInfo.id,
        code: roomInfo.code || undefined,
      });
    }
  }, [roomInfo, peerState.status, session]);

  // If the PeerState is not open render an error
  if (peerState.status !== 'open') {
    return null;
  }

  // Ensure the current joioned room is the same one
  if (joinedRoom?.slug === props.slug) {
    return <>{props.render(joinedRoom)}</>;
  }

  const sessionState = session ? session[props.slug] : undefined;

  if (roomInfo && !sessionState?.canJoin) {
    return (
      <FunWallpaper>
        <div className={cls.container}>
          <div className={cls.box}>
            <JoinRoomWizard
              myUser={peerState.me.user}
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

const useStyles = createUseStyles<CustomTheme>(theme => ({
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
