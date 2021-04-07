import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { PeerState, usePeerState } from 'src/providers/PeerProvider';
import { colors } from 'src/theme';

type Props = {};

const getStatusColor = (peerState: PeerState) => {
  if (peerState.status !== 'open') {
    return colors.neutral;
  }

  if (peerState.hasJoinedRoom && peerState.connected) {
    return colors.primary;
  }

  return colors.positive;
};

export const RoomDetails: React.FC<Props> = (props) => {
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
          <div
            className={cls.dot}
            style={{
              backgroundColor: getStatusColor(peerState),
            }}
          />
          <br />
          <Text size="small2">Peers:</Text>
          <Text size="small1">{` ${peerState.room.peersCount}`}</Text>
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
