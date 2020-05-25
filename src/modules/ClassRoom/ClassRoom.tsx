import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Room } from 'src/components/RoomProvider';
import { Grid, Box } from 'grommet';
import { FaceTime } from 'src/components/FaceTimeArea';
import { MemberList } from './components/MemberList';
import { MemberStreamingReel } from './components/MemberStreamingReel/MemberStreamingReel';

type Props = {
  room: Room;
};

export const ClassRoom: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
  // <Grid
  //   // className={cls.container}
  //   fill
  //   rows={['auto']}
  //   columns={['auto']}
  //   areas={[
  //     { name: 'main', start: [1, 1], end: [1, 1] },
  //     { name: 'side', start: [1, 0], end: [1, 1] },
  //   ]}
  // >
  //   <Box
  //     gridArea="main"
  //     className={cls.main}
  //     justify="center"
  //     align="center"
  //   >
  //     main

  //   </Box>
  //   <Box
  //     gridArea="side"
  //     className={cls.side}
  //   >
  //     side
  //   </Box>
  // </Grid>

    <div className={cls.container}>
      <main className={cls.main}>
        <FaceTime
          containerClassName={cls.faceTime}
          streamConfig={props.room.me.connection.channels.streaming}
          streamingOffFallback={(
            <div className={cls.initialView} />
          )}
        />
        <MemberStreamingReel
          className={cls.streamingReel}
          peers={Object.values(props.room.peers)}
        />
      </main>
      <aside className={cls.side}>
        <MemberList peers={Object.values(props.room.peers)} />
      </aside>
    </div>
  );
};


const useStyles = createUseStyles({
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
  },
  main: {
    flex: 1,
    position: 'relative',
  },
  faceTime: {
    width: '100%',
    height: '100%',
  },
  initialView: {
    background: '#555',
    height: '100%',
    width: '100%',
  },
  side: {
    flex: 0.4,
    maxWidth: '380px',
  },
  streamingReel: {
    position: 'absolute',
    bottom: '10px',
    left: 0,
    right: 0,
    zIndex: 999,
  },
});
