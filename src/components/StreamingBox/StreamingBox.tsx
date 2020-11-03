import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Button, Box } from 'grommet';
import { FaceTime } from '../FaceTimeArea';
import { Peer, Room } from '../RoomProvider';
import { AspectRatio } from '../AspectRatio';
import { MultiStreamingBox } from './MultiStreamingBox';
import { Streamer } from './types';
import { softBorderRadius } from 'src/theme';

type Props = {
  room: Room;
  width?: number;
  focusedPeerId?: Peer['id'];
};

export const StreamingBox: React.FC<Props> = (props) => {
  const cls = useStyles();

  const activeStreamers = Object
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

  return (
    <div className={cls.container} style={{ width: props.width || '100%' }}>
      {(Object.keys(activeStreamers).length > 0) ? (
        <MultiStreamingBox
          focusedUserId={props.focusedPeerId}
          streamersMap={activeStreamers}
          myStreamingConfig={{
            streamingConfig: props.room.me.connection.channels.streaming,
            user: props.room.me.user,
          } as Streamer}
        />
      ) : (
        <>
          {props.room.me.connection.channels.streaming.on ? (
            <FaceTime
              streamConfig={props.room.me.connection.channels.streaming}
              className={cls.fullFacetime}
              muted
            />
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
  },
  reel: {
    position: 'absolute',
    bottom: '15px',
    right: '10px',
  },
  smallFacetime: {
    border: '2px solid rgba(0, 0, 0, .3)',
  },
  fullFacetime: {
    ...softBorderRadius,
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
