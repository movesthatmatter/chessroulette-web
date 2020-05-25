import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Box, Text, Grid } from 'grommet';
import { Peer } from 'src/components/RoomProvider';
import { FaceTime } from 'src/components/FaceTimeArea';
import { AspectRatio } from 'src/components/AspectRatio';

type Props = {
  className?: string;
  peers: Peer[];
};

export const MemberStreamingReel: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, props.className)}>
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
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  item: {
    // background: '#efefef',
    maxWidth: '200px',
    position: 'relative',
  },
  textContainer: {
    padding: '3px 6px',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, .8)',
    color: '#000',
    // opacity: 0.5,
  },
});
