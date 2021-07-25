import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { Room, usePeerState } from 'src/providers/PeerProvider';
import { colors } from 'src/theme';

type Props = {
  room: Room;
};

export const RoomDetails: React.FC<Props> = ({ room }) => {
  const cls = useStyles();
  // const peerState = usePeerState();

  return (
    <div className={cls.container}>
      <div
        style={{
          lineHeight: 0,
        }}
      >
        <Text size="small2">Room:</Text>
        <Text size="small1">{` ${room.name}  `}</Text>
        <br />
        <Text size="small2">Active Members:</Text>
        <Text size="small1">{` ${Object.keys(room.peersIncludingMe).length}`}</Text>
      </div>
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
