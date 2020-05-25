import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Box, Text } from 'grommet';
import { Peer } from 'src/components/RoomProvider';
import { FaceTime } from 'src/components/FaceTimeArea';

type Props = {
  className?: string;
  peers: Peer[];
  maxItemsShow?: number;
};

const itemWidth = 200;
const itemMargin = 6;

export const MemberStreamingReel: React.FC<Props> = ({
  maxItemsShow = 4,
  ...props
}) => {
  const cls = useStyles();

  return (
    <div
      className={cx(cls.container, props.className)}
    >
      <div
        className={cls.reelMask}
        style={{
          width: `${Math.min(maxItemsShow, props.peers.length) * (itemWidth + itemMargin)}px`,
        }}
      >
        <div
          className={cls.reel}
          style={{
            width: `${props.peers.length * (itemWidth + itemMargin)}px`,
          }}
        >
          {props.peers.map((peer) => (
            <Box
              key={peer.id}
              as="article"
              margin="xxsmall"
              className={cls.item}
            >
              <FaceTime
                streamConfig={peer.connection.channels.streaming}
              />
              <div className={cls.textContainer}>
                <Text size="small">{peer.name}</Text>
              </div>
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  reel: {},
  reelMask: {
    overflow: 'scroll',
  },
  item: {
    width: `${itemWidth}px`,
    position: 'relative',
    float: 'left',
  },
  textContainer: {
    padding: '3px 6px',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, .8)',
    color: '#000',
  },
});
