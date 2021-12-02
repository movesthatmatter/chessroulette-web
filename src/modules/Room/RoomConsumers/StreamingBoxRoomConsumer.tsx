import React, { useContext } from 'react';
import { DarkModeSwitch } from 'src/components/DarkModeSwitch/DarkModeSwitch';
import { Logo } from 'src/components/Logo';
import { StreamingBox, StreamingBoxProps } from 'src/components/StreamingBox';
import { createUseStyles } from 'src/lib/jss';
import { PeerInfo } from 'src/providers/PeerProvider';
import { hideOnDesktop, onlyDesktop, onlyMobile } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { RoomProviderContext } from '../RoomProvider';

type Props = Omit<StreamingBoxProps, 'room'> & {
  isMobile?: boolean;
};

export const StreamingBoxRoomConsumer: React.FC<Props> = (props) => {
  const cls = useStyles();
  const roomContext = useContext(RoomProviderContext);

  if (!(roomContext && roomContext.room.p2pCommunicationType !== 'none')) {
    // Show Loader
    return null;
  }

  return (
    <StreamingBox
      room={roomContext.room}
      {...props}
      headerOverlay={({ inFocus }) => (
        <div className={cls.header}>
          <Logo withBeta={false} asLink={false} mini withOutline className={cls.logoStreamingBox} />
          <div style={{ flex: 1, ...hideOnDesktop }} />
          <div className={cls.peerInfoWrapper}>
            <PeerInfo darkBG reversed peerUserInfo={inFocus} />
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
