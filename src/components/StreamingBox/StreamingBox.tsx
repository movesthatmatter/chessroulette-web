import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { MemberStreamingReel } from 'src/modules/ClassRoom/components/MemberStreamingReel';
import { Text } from 'grommet';
import { FaceTime } from '../FaceTimeArea';
import { PeerConnections } from '../PeersProvider';
import { Peer, Room } from '../RoomProvider';

type Props = {
  me: Peer;
  peer: Peer;
  // peers: Room['peers'];
  width: number;
};

export const StreamingBox: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container} style={{ width: props.width }}>
      <div>
        <FaceTime
          streamConfig={props.peer.connection.channels.streaming}
          className={cls.peerFacetime}
        />
        <div className={cls.titleWrapper}>
          <Text className={cls.title}>{props.peer.name}</Text>
        </div>
      </div>
      <FaceTime
        streamConfig={props.me.connection.channels.streaming}
        className={cls.myFacetime}
        style={{
          width: props.width / 4,
        }}
      />
      {/* <MemberStreamingReel
        className={cls.reel}
        peers={Object.values(props.peers)}
        itemWidth={props.width / 5}
        itemMargin={props.width / 50}
        style={{
          padding: `${props.width / 50}px`,
          paddingBottom: `${props.width / 50}px`,
        }}
      /> */}
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
  peerFacetime: {},
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
