import React, { useMemo } from 'react';
import { MultiFaceTimeGrid } from 'src/components/FaceTime';
import { createUseStyles } from 'src/lib/jss';
import { SwitchActivityWidgetRoomConsumer } from 'src/modules/Room/RoomConsumers/SwitchActivityWidgetRoomConsumer';
import { spacers } from 'src/theme/spacers';
import { Logo } from 'src/components/Logo';
import { Close } from 'grommet-icons';
import { colors } from 'src/theme/colors';
import { noop } from 'src/lib/util';
import { Room } from 'src/modules/Room/types';
import { useStreamingPeers } from 'src/providers/PeerConnectionProvider';

type Props = {
  room: Room;
};

export const MeetupLayer: React.FC<Props> = (props) => {
  const cls = useStyles();
  const { state: reelState } = useStreamingPeers({ peersMap: props.room.peers });

  const allStreamingPeers = useMemo(() => {
    if (!reelState.ready) {
      return [];
    }

    return Object.values(reelState.streamersMap);
  }, [reelState]);

  return (
    <div className={cls.container}>
      <div className={cls.header}>
        <div className={cls.logoWrapper} style={{ flex: 1, marginRight: '10px' }}>
          <Logo withBeta darkBG />
        </div>
        <SwitchActivityWidgetRoomConsumer
          render={({ toggleInMeetup }) => (
            <div onClick={() => toggleInMeetup(false)} className={cls.exitButton}>
              <Close className={cls.exitIcon} />
            </div>
          )}
        />
      </div>
      <div className={cls.main}>
        <div className={cls.reelWrapper}>
          <MultiFaceTimeGrid
            me={props.room.me}
            streamingPeers={allStreamingPeers}
            containerClassName={cls.reel}
            itemClassName={cls.reelItem}
            mirrorMyFaceTime={false}
            onClick={noop}
          />
        </div>
      </div>
      <div className={cls.footer} />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'space-between',
  },
  main: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    paddingTop: spacers.default,
    paddingBottom: spacers.larger,
    paddingLeft: spacers.large,
    paddingRight: spacers.large,
  },
  logoWrapper: {},
  footer: {
    width: '100%',
    height: '180px',
  },

  facetimeWrapper: {
    width: '50%',
  },
  reelWrapper: {
    width: '100%',
    padding: spacers.small,
  },
  reel: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  reelItem: {
    width: '100%',
    maxWidth: '50%',
    marginLeft: spacers.default,
    marginRight: spacers.default,
    marginTop: 0,
  },
  myReelItem: {},
  exitButton: {
    cursor: 'pointer',
  },
  exitIcon: {
    fill: `${colors.universal.white} !important`,
    stroke: `${colors.universal.white} !important`,
  },
});
