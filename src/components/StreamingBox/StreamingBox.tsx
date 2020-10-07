import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Text, Button, Box } from 'grommet';
import { FaceTime } from '../FaceTimeArea';
import { Peer, Room } from '../RoomProvider';
import { AspectRatio } from '../AspectRatio';
import { MultiStreamingBox } from './MultiStreamingBox';

type Props = {
  room: Room;
  width: number;
  focusedPeerId?: Peer['id'];
};

export const StreamingBox: React.FC<Props> = (props) => {
  const cls = useStyles();

  const peersOnStreamConfig = Object
    .values(props.room.peers)
    .reduce((prev, next) => {
      if (!next.connection.channels.streaming.on) {
        return prev;
      }

      return {
        ...prev,
        [next.id]: {
          user: next.user,
          streamingConfig: next.connection.channels.streaming,
        }
      }
    }, {});

  // Only shows the 1st peer for now!
  return (
    <div className={cls.container} style={{ width: props.width }}>
      {(Object.keys(peersOnStreamConfig).length > 0) ? (
        <MultiStreamingBox
          focusOn={props.focusedPeerId}
          peerStreamConfigsMap={peersOnStreamConfig}
          myStreamConfig={{
            streamingConfig: props.room.me.connection.channels.streaming,
            user: props.room.me.user,
          }}
          reelFacetimeWidth={props.width / 4}
        />
      ) : (
        <>
          {props.room.me.connection.channels.streaming.on ? (
            <>
            <div className={cls.titleWrapper}>
              <Text className={cls.title}>Me</Text>
            </div>
              <FaceTime
                streamConfig={props.room.me.connection.channels.streaming}
                className={cls.fullFacetime}
                muted
              />
            </>
          ) : (
            <AspectRatio className={cls.noFacetime}>
              <Box alignContent="center" justify="center">
                <Button type="button">Start Streaming</Button>
              </Box>
            </AspectRatio>
          )}
        </>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  reel: {
    position: 'absolute',
    bottom: '15px',
    right: '10px',
  },
  smallFacetime: {
    // position: 'absolute',
    border: '2px solid rgba(0, 0, 0, .3)',
    // opacity: 0.95,
  },
  fullFacetime: {
    // width: '100%',
    // height: 'auto', // to make sure it maintains the aspect ratio
  },
  noFacetime: {
    background: '#ededed',
  },
  title: {
    background: 'rgba(255, 255, 255, .8)',
    textAlign: 'center',
    padding: '5px',
    borderRadius: '5px',
  },
  titleWrapper: {
    position: 'absolute',
    top: '20px',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});
