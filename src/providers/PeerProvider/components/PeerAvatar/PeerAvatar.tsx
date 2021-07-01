import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ConnectionStatusDot } from '../ConnectionStatusDot';
import { Avatar } from 'src/components/Avatar';
import { colors } from 'src/theme';
import { Peer } from '../../types';
import { useSelector } from 'react-redux';
import { selectPeerProviderState } from '../../redux/selectors';

type Props = {
  size?: string;
  className?: string;
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

export const PeerAvatar: React.FC<Props> = ({ size, ...props }) => {
  const cls = useStyles();
  const room = useSelector(selectPeerProviderState).room;

  const peer = props.peer || room?.peersIncludingMe[props.peerUserInfo.id];

  return (
    <div>
      <div
        className={`${cls.container} ${props.className}`}
        style={{
          ...(size && {
            width: size,
          }),
        }}
      >
        <ConnectionStatusDot
          peer={peer}
          containerClassName={cls.connectionDotContainer}
          dotClassName={cls.connectionDot}
          size="25%"
        />
        <Avatar
          mutunachiId={peer ? Number(peer.user.avatarId) : Number(props.peerUserInfo?.avatarId)}
        />
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
    bottom: 'calc(5% + 2px)',
    right: 'calc(5% + 2px)',
  },
  connectionDot: {
    border: `2px solid ${colors.white}`,
  },
});
