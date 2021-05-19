import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { usePeerState } from 'src/providers/PeerProvider';
import { colors } from 'src/theme';

type Props = {};

export const RoomDetails: React.FC<Props> = () => {
  const cls = useStyles();
  const peerState = usePeerState();

  return (
    <div className={cls.container}>
      {peerState.status === 'open' && peerState.hasJoinedRoom && (
        <div
          style={{
            lineHeight: 0,
          }}
        >
          <Text size="small2">Room:</Text>
          <Text size="small1">{` ${peerState.room.name}  `}</Text>
          <br />
          <Text size="small2">Active Peers:</Text>
          <Text size="small1">{` ${Object.keys(peerState.room.peersIncludingMe).length}`}</Text>
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  dot: {
    height: '8px',
    width: '8px',
    backgroundColor: colors.neutral,
    borderRadius: '50%',
    display: 'inline-block',
  },
});
