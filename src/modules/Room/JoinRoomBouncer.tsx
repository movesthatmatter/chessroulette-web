import { RoomRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { FunWallpaper } from 'src/components/FunWallpaper';
import { createUseStyles } from 'src/lib/jss';
import { usePeerState } from 'src/providers/PeerProvider';
import { colors, floatingShadow, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import * as roomResources from './resources';
import { resources } from 'src/resources';
import { JoinRoomWizard } from './wizards/JoinRoomWizard';
import { JoinedRoom } from './types';
import { useJoinedRoom } from './hooks/useJoinedRoom';

type Props = {
  slug: RoomRecord['slug'];
  render: (r: JoinedRoom) => React.ReactNode;
};

type State = {
  loading: boolean;
} & (
  | {
      roomInfo: undefined;
      canJoin: false;
    }
  | {
      roomInfo: RoomRecord;
      canJoin: boolean;
    }
);

export const JoinRoomBouncer: React.FC<Props> = (props) => {
  const cls = useStyles();
  const peerState = usePeerState();
  const joinedRoom = useJoinedRoom();
  const [state, setState] = useState<State>({
    loading: false,
    canJoin: false,
    roomInfo: undefined,
  });

  // Fetch the Room Info
  useEffect(() => {
    if (peerState.status !== 'open') {
      return;
    }

    if (state.roomInfo) {
      return;
    }

    roomResources.getRoomBySlug(props.slug).map((roomInfo) => {
      const iamHost = roomInfo.createdBy === peerState.me.id;

      setState({
        roomInfo,
        canJoin: iamHost,
        loading: iamHost,
      });
    });
  }, [state, props.slug, peerState.status]);

  // Join the Room once the canJoin is true
  useEffect(() => {
    if (peerState.status === 'open' && !peerState.hasJoinedRoom && state.canJoin) {
      peerState.joinRoom({
        id: state.roomInfo.id,
        code: state.roomInfo.code || undefined,
      });
    }
  }, [state.canJoin, peerState.status]);

  useEffect(() => {
    if (joinedRoom) {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, [joinedRoom, state.loading]);

  if (joinedRoom) {
    return <>{props.render(joinedRoom)}</>;
  }

  if (state.roomInfo && !state.loading) {
    return (
      <FunWallpaper>
        <div className={cls.container}>
          <div className={cls.box}>
            <JoinRoomWizard
              roomInfo={state.roomInfo}
              onFinished={(wizardState) => {
                if (peerState.status !== 'open') {
                  return;
                }

                if (wizardState.challengeAccepted) {
                  resources
                    .acceptChallenge({
                      id: wizardState.pendingChallenge.id,
                      userId: peerState.me.id,
                    })
                    .map(() => {
                      setState({
                        canJoin: true,
                        roomInfo: state.roomInfo,
                        loading: true,
                      });
                    });
                } else {
                  setState({
                    canJoin: true,
                    roomInfo: state.roomInfo,
                    loading: true,
                  });
                }
              }}
            />
          </div>
        </div>
      </FunWallpaper>
    );
  }

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
