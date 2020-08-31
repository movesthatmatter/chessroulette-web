import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Text, Button } from 'grommet';
import { FaceTime } from '../FaceTimeArea';
import { Peer } from '../RoomProvider';
import { AspectRatio } from '../AspectRatio';

type Props = {
  me: Peer;
  peer?: Peer;
  width: number;
};

export const StreamingBox: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container} style={{ width: props.width }}>
      {props.peer ? (
        <>
          <FaceTime
            streamConfig={props.peer.connection.channels.streaming}
            className={cls.fullFacetime}
          />
          <div className={cls.titleWrapper}>
            <Text className={cls.title}>{props.peer.user.name}</Text>
          </div>
          <FaceTime
            streamConfig={props.me.connection.channels.streaming}
            className={cls.myFacetime}
            style={{
              width: props.width / 4,
            }}
          />
        </>
      ) : (
        <>
          {props.me.connection.channels.streaming.on ? (
            <FaceTime
              streamConfig={props.me.connection.channels.streaming}
              className={cls.fullFacetime}
            />
          ) : (
            <AspectRatio className={cls.noFacetime}>
              <Button type="button">
                Start Streaming
              </Button>
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
    backgroundColor: 'rgba(0, 0, 0, .3)',
    position: 'absolute',
    bottom: 0,
    right: 0,
    // width: '100%',
  },
  myFacetime: {
    position: 'absolute',
    bottom: '15px',
    right: '10px',
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
