import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import {
  Heading, Box, Button, Form, TextInput,
} from 'grommet';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';
import { CreateRoomRequest, CreateRoomResponse, UserRecord } from 'dstnd-io';
import { Result } from 'ts-results';
import { createRoom } from 'src/resources/resources';

type Props = {
  onSetUser: (
    userInfo: { name: string },
    // roomInfo: Omit<CreateRoomRequest, 'peerId'>
  ) => Promise<Result<UserRecord, unknown>>;
};

const toRoomPath = (room: {
  id: string;
  type: 'public' | 'private';
  code?: string;
}) => `${room.id}${room.type === 'private' ? `/${room.code}` : ''}`;

export const Onboarding: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [showForm, setShowForm] = useState<'none' | 'student' | 'instructor'>(
    'student',
  );
  const history = useHistory();

  return (
    <div className={cls.container}>
      <Box className={cls.main} as="main" justify="center">
        <Heading level={3}>Welcome to 101Chess</Heading>
        {showForm === 'none' && (
          <>
            <Button
              className={cls.button}
              primary
              type="button"
              size="large"
              margin="small"
              focusIndicator={false}
              onClick={() => setShowForm('instructor')}
            >
              I am an Instructor
            </Button>
            <Button
              primary
              reverse
              type="button"
              className={cx(cls.button, cls.buttonClear)}
              margin="small"
              size="large"
              focusIndicator={false}
              onClick={() => setShowForm('student')}
            >
              I am a Student
            </Button>
          </>
        )}
        {showForm === 'instructor' && (
          <>
            <Form>
              <TextInput
                name="name"
                placeholder="Your name"
                className={cls.input}
              />
              <TextInput placeholder="Classroom name" className={cls.input} />
            </Form>
            <Button
              className={cls.button}
              primary
              type="button"
              size="large"
              focusIndicator={false}
            >
              Create Classroom
            </Button>
            <Button
              className={cls.button}
              type="button"
              size="large"
              focusIndicator={false}
              onClick={() => setShowForm('none')}
            >
              Cancel
            </Button>
          </>
        )}
        {showForm === 'student' && (
          <>
            <Form>
              <TextInput
                name="name"
                placeholder="Your name"
                className={cls.input}
              />
              <TextInput placeholder="Classroom code" className={cls.input} />
            </Form>
            <Button
              className={cx(cls.button, cls.button)}
              primary
              type="button"
              size="large"
              focusIndicator={false}
              onClick={async () => {
                (await props.onSetUser({ name: 'John The Frog' }))
                  .map((user) => createRoom({
                    nickname: 'my room',
                    type: 'private',
                    peerId: user.id,
                  }))
                  .map(async (roomPromise) => {
                    (await roomPromise).map((room) => {
                      history.push(`/classroom/${toRoomPath(room)}`);
                    });
                  });
              }}
            >
              Join Classroom
            </Button>
            <Button
              className={cls.button}
              type="button"
              size="large"
              focusIndicator={false}
              onClick={() => setShowForm('none')}
            >
              Cancel
            </Button>
          </>
        )}
      </Box>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    // background: 'red',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: 'column',
  },
  main: {
    border: '2px solid #efefef',
    padding: '1em 2em',
    borderRadius: '24px',
  },
  button: {
    textAlign: 'center',
    padding: '10px',
    '&:hover': {
      opacity: 0.8,
    },
  },
  buttonClear: {
    border: '2px solid #7D4CDB',
    background: 'transparent',
    color: '#7D4CDB',
    padding: '8px',
  },
  input: {
    marginBottom: '16px',
    border: '2px solid #efefef',
    borderRadius: '24px',
  },
});
