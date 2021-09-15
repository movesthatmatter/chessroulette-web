import { RoomRecord } from 'dstnd-io';
import React, { useEffect } from 'react';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { FunWallpaper } from 'src/components/FunWallpaper';
import { createUseStyles } from 'src/lib/jss';
import { usePeerState } from 'src/providers/PeerProvider';
import { colors, floatingShadow, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import * as roomResources from '../resources';
import { resources } from 'src/resources';
import { JoinRoomWizard } from '../wizards/JoinRoomWizard';
import { JoinedRoom } from '../types';
import { useJoinedRoom } from '../hooks/useJoinedRoom';
import { useSession } from 'src/services/Session';
import { console, JSON } from 'window-or-global';
import { AwesomeErrorPage } from 'src/components/AwesomeError';

type Props = {
  slug: RoomRecord['slug'];
  render: (r: JoinedRoom) => React.ReactNode;
};

// type State = {
//   // loading: boolean;
// } & (
//   | {
//       roomInfo: undefined;
//       canJoin: false;
//     }
//   | {
//       roomInfo: RoomRecord;
//       canJoin: boolean;
//       joining: boolean;
//     }
// );

type State = {
  [roomSlug: string]: {
    canJoin: boolean;
    roomInfo: RoomRecord;
  };
};

export const JoinRoomBouncer: React.FC<Props> = (props) => {
  const cls = useStyles();
  const peerState = usePeerState();
  const joinedRoom = useJoinedRoom();

  const [state, setState] = useSession<State>('roomBouncer');

  // useEffect(() => {
  //   console.log('JoinRoomBouncer peerState updated', peerState);
  // }, [peerState]);

  // useEffect(() => {
  //   console.group('[JoinRoomBouncer]');
  //   console.log('state', state);
  //   console.log('joined room', joinedRoom);
  //   console.groupEnd();
  // }, [joinedRoom, state]);

  // Fetch the Room Info
  useEffect(() => {
    if (peerState.status !== 'open') {
      return;
    }

    if (state && state[props.slug]) {
      // Don't reload the room info if it's already present
      return;
    }

    roomResources.getRoomBySlug(props.slug).map((roomInfo) => {
      setState({
        [roomInfo.slug]: {
          roomInfo,
          // If I'm the host let me join right away
          canJoin: peerState.me.id === roomInfo.createdBy,
        },
      });
    });
  }, [props.slug, peerState.status, state]);

  // Join the Room once the canJoin is true
  useEffect(() => {
    if (
      peerState.status === 'open' &&
      !peerState.hasJoinedRoom &&
      state &&
      state[props.slug]?.canJoin
    ) {
      const roomInfo = state[props.slug].roomInfo;

      peerState.joinRoom({
        id: roomInfo.id,
        code: roomInfo.code || undefined,
      });
    }
  }, [state, peerState.status]);

  // If the PeerState render an error
  if (peerState.status !== 'open') {
    return null;
  }

  if (joinedRoom) {
    return <>{props.render(joinedRoom)}</>;
  }

  const roomInfoState = state ? state[props.slug] : undefined;

  if (roomInfoState?.canJoin === false) {
    return (
      <FunWallpaper>
        <div className={cls.container}>
          <div className={cls.box}>
            <JoinRoomWizard
              myUser={peerState.me.user}
              roomInfo={roomInfoState.roomInfo}
              onFinished={() => {
                setState({
                  [props.slug]: {
                    ...roomInfoState,
                    canJoin: true,
                  },
                });
              }}
            />
          </div>
        </div>
      </FunWallpaper>
    );
  }

  // return <pre>{JSON.stringify(state, null, 2)}</pre>;

  // return (
  //   <
  // )

  return <AwesomeLoaderPage />;
};

const useStyles = createUseStyles({
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
    background: colors.white,
    ...floatingShadow,
    ...softBorderRadius,
    padding: spacers.large,
  },
});
