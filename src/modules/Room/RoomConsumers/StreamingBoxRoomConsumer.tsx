import React, { useContext } from 'react';
import { Logo } from 'src/components/Logo';
import { StreamingBox, StreamingBoxProps } from 'src/components/StreamingBox';
import { createUseStyles } from 'src/lib/jss';
import { PeerInfo } from 'src/providers/PeerProvider';
import { spacers } from 'src/theme/spacers';
import { RoomProviderContext } from '../RoomProvider';

type Props = Omit<StreamingBoxProps, 'room'> & {};

export const StreamingBoxRoomConsumer: React.FC<Props> = (props) => {
  const cls = useStyles();
  const roomContext = useContext(RoomProviderContext);

  if (!roomContext) {
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
          <div className={cls.peerInfoWrapper}>
            <PeerInfo darkBG reversed peerUserInfo={inFocus} />
          </div>
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles({
  logoStreamingBox: {
    padding: spacers.get(.7),
    marginTop: '-5px',
    width: '48px',
  },
  header: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  peerInfoWrapper: {
    flex: 1,
    display: 'flex',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    padding: spacers.get(.7),
  },
});
