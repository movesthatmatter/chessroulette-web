import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ConnectionStatusDot } from '../ConnectionStatusDot';
import { Avatar } from 'src/components/Avatar';
import { colors } from 'src/theme';
import { Peer } from '../../types';
import { useSelector } from 'react-redux';
import { selectPeerProviderState } from '../../redux/selectors';
import { Text } from 'src/components/Text';
import { spacers } from 'src/theme/spacers';
import { getUserDisplayName } from 'src/modules/User';

type Props = {
  size?: string;
  className?: string;
  hasUserInfo?: boolean;
} & (
  | {
      peer: Peer;
      peerUserInfo?: undefined;
    }
  | {
      peer?: undefined;
      peerUserInfo: Pick<Peer['user'], 'avatarId' | 'id' | 'isGuest'>;
    }
);

const getStatusInfo = (peer?: Peer) => {
  if (!peer) {
    return 'Not Online';
  }

  if (peer.hasJoinedRoom) {
    if (peer.connection.channels.streaming.on) {
      return `${getUserDisplayName(peer.user)} Is Currently Streaming`;
    }

    if (peer.connection.channels.data.on) {
      return `${getUserDisplayName(peer.user)} Is Online`;
    }

    return `${getUserDisplayName(peer.user)} Is Joining`;
  }

  return `${getUserDisplayName(peer.user)} Is Not In The Room`;
};

export const PeerAvatar: React.FC<Props> = ({ size, hasUserInfo = false, ...props }) => {
  const cls = useStyles();
  const room = useSelector(selectPeerProviderState).room;
  const peer = props.peer || room?.peersIncludingMe[props.peerUserInfo.id];

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div>
      <div
        className={`${cls.container} ${props.className}`}
        style={{
          ...(size && {
            width: size,
          }),
        }}
        {...(hasUserInfo && {
          onMouseOver: () => setShowInfo(true),
          onMouseLeave: () => setShowInfo(false),
        })}
      >
        <ConnectionStatusDot
          peer={peer}
          containerClassName={cls.connectionDotContainer}
          dotClassName={cls.connectionDot}
          size="25%"
        />
        <Avatar
          mutunachiId={peer ? Number(peer.user.avatarId) : Number(props.peerUserInfo?.avatarId)}
          size={size}
        />
        {hasUserInfo && showInfo && (
          <div className={cls.infoContainer}>
            <div className={cls.infoText}>
              <Text size="small1">{getStatusInfo(peer)}</Text>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    position: 'relative',
  },
  connectionDotContainer: {
    position: 'absolute',
    zIndex: 9,
    bottom: 'calc(15% - 2px)',
    right: 'calc(10% - 2px)',
  },
  connectionDot: {
    border: `2px solid ${colors.white}`,
  },
  infoContainer: {
    position: 'absolute',

    top: 0,
    bottom: 0,
    left: '100%',
    zIndex: 999,
  },
  infoText: {
    marginLeft: spacers.small,
    border: `1px solid ${colors.neutralDark}`,
    padding: spacers.small,
    paddingTop: 0,
    borderRadius: '8px',
    background: colors.white,
  },
});