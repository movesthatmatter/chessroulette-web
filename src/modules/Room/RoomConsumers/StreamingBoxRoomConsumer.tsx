import React, { useContext, useMemo } from 'react';
import { DarkModeSwitch } from 'src/components/DarkModeSwitch/DarkModeSwitch';
import {
  MultiFaceTimeCompact,
  MultiFaceTimeCompactProps,
} from 'src/components/FaceTime/MultiFaceTimeCompact';
import { Logo } from 'src/components/Logo';
import { createUseStyles } from 'src/lib/jss';
import { PeerInfo, useStreamingPeers } from 'src/providers/PeerConnectionProvider';
import { hideOnDesktop, onlyMobile } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { JoinedRoomProviderContext } from '../Providers/JoinedRoomProvider';
import { Room } from '../types';

type Props = Omit<
  MultiFaceTimeCompactProps,
  'reelStreamingPeers' | 'myStreamingPeerId' | 'onFocus' | 'focusedStreamingPeer'
> & {
  isMobile?: boolean;
};

const StreamingBoxRoomConsumerWithGivenRoom: React.FC<Props & { room: Room }> = ({
  room,
  ...props
}) => {
  const cls = useStyles();
  const { state, onFocus } = useStreamingPeers({ peersMap: room.peers });

  const reel = useMemo(() => {
    return state.ready
      ? {
          streamingPeers: state.reel,
          myStreamingPeerId: room.me.userId,
          focusedStreamingPeer: state.inFocus,
        }
      : undefined;
  }, [state]);

  return (
    <MultiFaceTimeCompact
      reel={reel}
      onFocus={onFocus}
      {...props}
      headerOverlay={({ inFocus }) => (
        <div className={cls.header}>
          <Logo withBeta={false} asLink={false} mini withOutline className={cls.logoStreamingBox} />
          <div style={{ flex: 1, ...hideOnDesktop }} />
          <div className={cls.peerInfoWrapper}>
            {inFocus && <PeerInfo darkBG reversed peerUserInfo={inFocus} />}
            {props.isMobile && (
              <div style={{ marginTop: '10px', alignSelf: 'flex-end' }}>
                <DarkModeSwitch />
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
};

export const StreamingBoxRoomConsumer: React.FC<Props> = (props) => {
  const roomContext = useContext(JoinedRoomProviderContext);

  if (!roomContext) {
    // Show Loader
    return null;
  }

  return <StreamingBoxRoomConsumerWithGivenRoom room={roomContext.room} {...props} />;
};

const useStyles = createUseStyles({
  logoStreamingBox: {
    padding: spacers.get(0.7),
    marginTop: '-5px',
    width: '48px',
  },
  header: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  peerInfoWrapper: {
    ...onlyMobile({
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }),
    flex: 1,
    display: 'flex',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    padding: spacers.get(0.7),
  },
});
