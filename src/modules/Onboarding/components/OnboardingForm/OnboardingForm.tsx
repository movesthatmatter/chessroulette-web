import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import {
  Box, Heading, Button, Form, TextInput, Text,
} from 'grommet';
import cx from 'classnames';
import { getInputValidator } from 'src/lib/inputValidator';
import { Form as FinalForm, Field } from 'react-final-form';

export type InstructorInput = {
  userName: string;
  roomName: string;
}

export type StudentInput = {
  userName: string;
  roomCode: string;
}

export type OnboardingFormProps = {
  onCreateClassroom: (input: InstructorInput) => void;
  onJoinClassroom: (input: StudentInput) => void;

  mode?: 'none' | 'student' | 'instructor';
};

const instructorValidator = getInputValidator<InstructorInput>((v) => ({
  userName: v.required,
  roomName: v.required,
}));

const studentValidator = getInputValidator<StudentInput>((v) => ({
  userName: v.required,
  roomCode: v.required,
}));

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  mode = 'none',
  ...props
}) => {
  const cls = useStyles();
  const [showForm, setShowForm] = useState(mode);

  return (
    <Box className={cls.container} as="main" justify="center">
      {showForm === 'none' && (
        <>
          <Heading level={3}>Welcome to 101Chess</Heading>
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
            className={cx(cls.button)}
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
          <Heading level={3}>Instructor Registration</Heading>
          <FinalForm
            validate={instructorValidator}
            onSubmit={props.onCreateClassroom}
            render={({ handleSubmit }) => (
              <>
                <Form>
                  <Field
                    name="userName"
                    render={({ input, meta }) => (
                      <>
                        <TextInput
                          {...input}
                          placeholder="Your name"
                          className={cx(cls.input, {
                            [cls.inputWithError]: meta.error && meta.touched,
                          })}
                        />
                      </>
                    )}
                  />
                  <Field
                    name="roomName"
                    render={({ input, meta }) => (
                      <>
                        <TextInput
                          {...input}
                          placeholder="Classroom name"
                          className={cx(cls.input, {
                            [cls.inputWithError]: meta.error && meta.touched,
                          })}
                        />
                      </>
                    )}
                  />
                </Form>
                <Button
                  className={cls.button}
                  primary
                  type="button"
                  size="large"
                  focusIndicator={false}
                  onClick={handleSubmit}
                >
                  Create Classroom
                </Button>
                <Button
                  className={cls.button}
                  type="button"
                  size="large"
                  focusIndicator={false}
                  onClick={() => setShowForm('student')}
                >
                  I am a Student
                </Button>

                {/* {errors} */}
              </>
            )}
          />
        </>
      )}
      {showForm === 'student' && (
        <>
          <Heading level={3}>Student Registration</Heading>
          <FinalForm
            validate={studentValidator}
            onSubmit={props.onJoinClassroom}
            render={({ handleSubmit }) => (
              <>
                <Form>
                  <Field
                    name="userName"
                    render={({ input, meta }) => (
                      <TextInput
                        {...input}
                        placeholder="Your name"
                        className={cx(cls.input, {
                          [cls.inputWithError]: meta.error && meta.touched,
                        })}
                      />
                    )}
                  />
                  <Field
                    name="roomCode"
                    render={({ input, meta }) => (
                      <TextInput
                        {...input}
                        placeholder="Classroom code"
                        className={cx(cls.input, {
                          [cls.inputWithError]: meta.error && meta.touched,
                        })}
                      />
                    )}
                  />
                </Form>
                <Button
                  className={cx(cls.button)}
                  primary
                  type="button"
                  size="large"
                  focusIndicator={false}
                  onClick={handleSubmit}
                >
                  Join Classroom
                </Button>
                <Button
                  className={cls.button}
                  type="button"
                  size="large"
                  focusIndicator={false}
                  onClick={() => setShowForm('instructor')}
                >
                  I am an Instructor
                </Button>
              </>
            )}
          />
        </>
      )}
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {
    // border: '2px solid #efefef',
    padding: '1em 2em',
    borderRadius: '24px',
    minWidth: '360px !important',
    textAlign: 'center',
  },
  button: {
    textAlign: 'center !important' as unknown as 'center',
    padding: '10px !important',
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
    marginBottom: '16px !important',
    border: '2px solid #efefef !important',
    borderRadius: '24px !important',
  },
  inputWithError: {
    borderColor: 'red !important',
  },
  fieldErrorMsg: {
    marginBottom: '1em !important',
  },
});
