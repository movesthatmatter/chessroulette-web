import { PeerRecord, UserInfoRecord } from 'dstnd-io';
import React from 'react';
import { useSelector } from 'react-redux';
import { createUseStyles } from 'src/lib/jss';
import { colors } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { Room } from '../../types';
import { selectPeerProviderState } from '../../redux/selectors';
import { keyInObject } from 'src/lib/util';

type Props = {
  // TODO: this might change to something else
  peerUserInfo: UserInfoRecord;
};

const getStatusColor = (
  peersIncludingMe: Room['peersIncludingMe'] | undefined,
  peerId: PeerRecord['id']
) => {
  if (peersIncludingMe) {
    if (keyInObject(peersIncludingMe, peerId) && peersIncludingMe[peerId].hasJoinedRoom) {
      if (peersIncludingMe[peerId].connection.channels.streaming.on) {
        return colors.positive;
      }

      return colors.attention;
    }

    return colors.negative;
  }

  return colors.neutral;
};

export const PeerWithConnectionStatusDisplay: React.FC<Props> = ({ peerUserInfo }) => {
  const cls = useStyles();
  const room = useSelector(selectPeerProviderState).room;

  return (
    <div className={cls.container}>
      {room?.me.id !== peerUserInfo.id && (
        <div
          className={cls.dot}
          style={{
            backgroundColor: getStatusColor(room?.peersIncludingMe, peerUserInfo.id),
            marginRight: spacers.smaller,
          }}
        />
      )}
      {peerUserInfo.name}
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
