import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Room } from 'src/components/RoomProvider';
import { Grid, Box, Button } from 'grommet';
import { FaceTime } from 'src/components/FaceTimeArea';
import { ChatBox } from 'src/components/ChatBox/ChatBox';
import { ChatBoxContainer } from 'src/components/ChatBox';
import { Workshop, View } from 'grommet-icons';
import { MemberList } from './components/MemberList';
import { MemberStreamingReel } from './components/MemberStreamingReel/MemberStreamingReel';
import { Chat } from './components/Chat';
import { BlackBoard, BlackBoardProps } from './components/BlackBoard';
import { ChessBoard } from '../Games/Chess/components/ChessBoard';
import { ChessStudy } from '../ChessStudy';

type Props = {
  room: Room;
};

export const ClassRoom: React.FC<Props> = (props) => {
  const cls = useStyles();

  const [mode, setMode] = useState<BlackBoardProps['mode']>('study');

  return (
    <div className={cls.container}>
      <main className={cls.main}>
        <header className={cls.header}>
          {mode === 'facetime' ? (
            <Button
              icon={<Workshop />}
              onClick={() => {
                setMode('study');
              }}
              className={cls.topButton}
            />
          ) : (
            <Button
              icon={<View />}
              onClick={() => {
                setMode('facetime');
              }}
              // className={cls.topButton}
              primary
            />
          )}

        </header>
        <BlackBoard
          mode={mode}
          facetimeComponent={(
            <FaceTime
              containerClassName={cls.faceTime}
              streamConfig={props.room.me.connection.channels.streaming}
              streamingOffFallback={(
                <div className={cls.initialView} />
              )}
            />
          )}
          studyComponent={(
            <ChessStudy
              className={cls.studyContainer}
              bottomPadding={200}
            />
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // height:
    display: 'flex',
    padding: '16px',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  topButton: {
    background: 'rgba(255, 255, 255)',
    borderRadius: '20px',
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
  studyContainer: {
    width: '100%',
    height: '100%',
    // background: 'red',
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
