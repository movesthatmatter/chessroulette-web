import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Text, Button } from 'grommet';
import { FaceTime } from '../FaceTimeArea';
import { Room } from '../RoomProvider';
import { AspectRatio } from '../AspectRatio';

type Props = {
  room: Room;
  width: number;
  opponentPeerId?: string;
};

export const StreamingBox: React.FC<Props> = (props) => {
  const cls = useStyles();

  const peersList = Object.values(props.room.peers);
  const opponentPeer = props.opponentPeerId && props.room.peers[props.opponentPeerId];

  // Only shows the 1st peer for now!
  return (
    <div className={cls.container} style={{ width: props.width }}>
      {opponentPeer ? (
        <>
          <FaceTime
            streamConfig={opponentPeer.connection.channels.streaming}
            className={cls.fullFacetime}
          />
          <div className={cls.titleWrapper}>
            <Text className={cls.title}>{opponentPeer.user.name}</Text>
          </div>
          <div className={cls.reel}>
            {peersList
              .filter((p) => p.id !== opponentPeer.user.id)
              .map((peer) => (
                <FaceTime
                  streamConfig={peer.connection.channels.streaming}
                  className={cls.smallFacetime}
                  style={{
                    width: props.width / 4,
                  }}
                />
              ))}
            <FaceTime
              streamConfig={props.room.me.connection.channels.streaming}
              className={cls.smallFacetime}
              style={{
                width: props.width / 4,
              }}
            />
          </div>
        </>
      ) : (
        <>
          {props.room.me.connection.channels.streaming.on ? (
            <>
              <FaceTime
                streamConfig={props.room.me.connection.channels.streaming}
                className={cls.fullFacetime}
              />
            </>
          ) : (
            <AspectRatio className={cls.noFacetime}>
              <Button type="button">Start Streaming</Button>
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
  // reel: {
  //   backgroundColor: 'rgba(0, 0, 0, .3)',
  //   position: 'absolute',
  //   bottom: 0,
  //   right: 0,
  //   // width: '100%',
  // },
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
