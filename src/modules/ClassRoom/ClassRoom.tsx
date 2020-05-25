import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Room } from 'src/components/RoomProvider';
import { Grid, Box } from 'grommet';
import { FaceTime } from 'src/components/FaceTimeArea';
import { ChatBox } from 'src/components/ChatBox/ChatBox';
import { ChatBoxContainer } from 'src/components/ChatBox';
import { MemberList } from './components/MemberList';
import { MemberStreamingReel } from './components/MemberStreamingReel/MemberStreamingReel';
import { Chat } from './components/Chat';

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
        <MemberList
          className={cls.memberList}
          peers={Object.values(props.room.peers)}
        />
        <Chat
          className={cls.chatContainer}
          myId={props.room.me.id}
          messages={[]}
          onSend={(msg) => {
            console.log('sending', msg);
          }}
        />
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
    borderLeft: '1px solid #efefef',
    boxShadow: '0px 0 10px #ddd',
    zIndex: 1,
    flex: 0.4,
    maxWidth: '380px',
    // background: 'yellow',
    display: 'flex',
    flexDirection: 'column',
  },
  memberList: {
    // flex: 1,
    maxHeight: '50vh',
    overflow: 'scroll',
    borderBottom: '1px solid #ddd',
  },
  chatContainer: {
    // background: 'green',
    flex: 1,
    // minHeight: '50vh',
  },
  streamingReel: {
    position: 'absolute',
    bottom: '10px',
    left: 0,
    right: 0,
    // zIndex: 999,
  },
});
