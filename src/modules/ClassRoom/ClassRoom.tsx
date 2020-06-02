import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Room } from 'src/components/RoomProvider';
import { Button } from 'grommet';
import { FaceTime } from 'src/components/FaceTimeArea';
import { Workshop, View } from 'grommet-icons';
import { MemberList } from './components/MemberList';
import { MemberStreamingReel } from './components/MemberStreamingReel/MemberStreamingReel';
import { ChatContainer } from './components/Chat';
import { BlackBoard, BlackBoardProps } from './components/BlackBoard';
import { ChessStudyContainer } from '../ChessStudy/ChessStudyContainer';

export type ClassroomProps = {
  room: Room;
  initialMode?: BlackBoardProps['mode'];
};

export const ClassRoom: React.FC<ClassroomProps> = ({
  initialMode = 'facetime',
  ...props
}) => {
  const cls = useStyles();
  const [mode, setMode] = useState<BlackBoardProps['mode']>(initialMode);

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
            <ChessStudyContainer
              room={props.room}
              className={cls.studyContainer}
              paddingTop={60}
              paddingBottom={200}
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
          me={props.room.me}
          peers={Object.values(props.room.peers)}
        />
        <ChatContainer className={cls.chatContainer} />
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
    background: 'rgba(18, 50, 65, .2)',
  },
  side: {
    borderLeft: '1px solid #efefef',
    boxShadow: '0px 0 10px #ddd',
    zIndex: 1,
    flex: 0.4,
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
  },
  memberList: {
    maxHeight: '50vh',
    overflow: 'scroll',
    borderBottom: '1px solid #ddd',
  },
  chatContainer: {
    flex: 1,
  },
  streamingReel: {
    position: 'absolute',
    bottom: '10px',
    left: 0,
    right: 0,
  },
});
