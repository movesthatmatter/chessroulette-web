import React from 'react';
import { AspectRatio } from 'src/components/AspectRatio';
import { createUseStyles } from 'src/lib/jss';
import { colors } from 'src/theme';
import { Peer } from '../../types';

export type PeerConnectionStatusDotProps = {
  peer?: Peer;
  size?: string;
  containerClassName?: string;
  dotClassName?: string;
};

const getStatusColor = (peer?: Peer) => {
  if (!peer) {
    return colors.neutral;
  }

  if (peer.hasJoinedRoom) {
    if (peer.connection.channels.streaming.on) {
      return colors.negative;
    }

    if (peer.connection.channels.data.on) {
      return colors.positive;
    }

    return colors.attention;
  }

  return colors.neutral;
};

export const ConnectionStatusDot: React.FC<PeerConnectionStatusDotProps> = ({
  peer,
  containerClassName,
  dotClassName,
  size = `8px`,
}) => {
  const cls = useStyles();

  return (
    <AspectRatio
      aspectRatio={{ width: 1, height: 1 }}
      style={{
        width: size,
      }}
      className={containerClassName}
    >
      <div
        className={`${cls.dot} ${dotClassName}`}
        style={{
          backgroundColor: getStatusColor(peer),
        }}
      />
    </AspectRatio>
  );
};

const useStyles = createUseStyles({
  dot: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.neutral,
    borderRadius: '50%',
  },
});
