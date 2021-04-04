import React from 'react';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { validator } from 'src/lib/validator';
import { updateUser } from 'src/services/Authentication/resources';
import { updateUserAction } from 'src/services/Authentication/actions';
import { RegisteredUserRecord } from 'dstnd-io';
import { useDispatch } from 'react-redux';
import { Avatar } from 'src/components/Avatar';
import { Hr } from 'src/components/Hr';

type Props = {
  user: RegisteredUserRecord;
};

export const UserDetails: React.FC<Props> = ({ user }) => {
  const cls = useStyles();
  const dispatch = useDispatch();

  console.log("user detais");

  return (
    <div className={cls.container}>
      <Avatar mutunachiId={Number(user.avatarId)} size="20%" />
      <div className={cls.spacer} />
      <div className={cls.requiredFieldsContainer}>
        <TextInput
          label="Email"
          value={user.email}
          readOnly
          placeholder="beth.harmon@queens.gambit"
          className={cls.input}
        />
        <TextInput
          label="Username"
          value="beth.harmon"
          readOnly
          placeholder="beth.harmon"
          className={cls.input}
        />
      </div>
      <div
        style={{
          paddingBottom: '24px',
        }}
      />
      <Hr text="Optional Details" />
      <div
        style={{
          paddingBottom: '24px',
        }}
      />
      <Form<Pick<RegisteredUserRecord, 'firstName' | 'lastName' | 'email'>>
        validator={{
          firstName: [validator.rules.name(), validator.messages.firstName],
          lastName: [validator.rules.name(), validator.messages.lastName],
        }}
        initialModel={user}
        validateOnChange
        onSubmit={(model) => {
          return updateUser({
            firstName: model.firstName,
            lastName: model.lastName,
          })
            .mapErr((e) => {
              return {
                type: 'SubmissionGenericError',
                content: undefined,
              } as const;
            })
            .map((user) => {
              dispatch(updateUserAction({ user }));
            });
        }}
        render={(p) => (
          <>
            <div className={cls.formContainer}>
              <div className={cls.inputWrapper}>
                <TextInput
                  label="First Name"
                  value={p.model.firstName}
                  placeholder="Beth"
                  className={cls.input}
                  onChange={({ target }) => p.onChange('firstName', target.value)}
                  validationError={
                    p.errors.validationErrors?.firstName ||
                    p.errors.submissionValidationErrors?.firstName
                  }
                />
              </div>
              <div className={cls.inputWrapper}>
                <TextInput
                  label="Last Name"
                  value={p.model.lastName}
                  placeholder="Beth"
                  className={cls.input}
                  onChange={({ target }) => p.onChange('lastName', target.value)}
                  validationError={
                    p.errors.validationErrors?.lastName ||
                    p.errors.submissionValidationErrors?.lastName
                  }
                />
              </div>
              <div className={cls.inputWrapper}>
                <TextInput
                  label="Prefered Language"
                  value="English"
                  placeholder="English"
                  className={cls.input}
                />
              </div>
              <div className={cls.inputWrapper}>
                <TextInput
                  label="Country"
                  value="Brazil"
                  placeholder="Brazil"
                  className={cls.input}
                />
              </div>
            </div>
            <div className={cls.inputWrapper}>
              <Button
                label="Save Changes"
                withLoader
                disabled={!p.canSubmit}
                type="positive"
                onClick={p.submit}
              />
            </div>
          </>
        )}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    height: '100%',
  },
  spacer: {
    marginBottom: '48px',
  },
  requiredFieldsContainer: {
    width: 'calc(50% - 12px)',
  },
  formContainer: {
    paddingBottom: '16px',
    display: 'flex',
    flexWrap: 'wrap',
  },
  inputWrapper: {
    flex: '0 1 50%',
    ...({
      '&:nth-child(odd)': {
        '& $input': {
          paddingRight: '12px',
        },
      },
      '&:nth-child(even)': {
        '& $input': {
          paddingLeft: '12px',
        },
      },
    } as CSSProperties),
  },
  input: {},
});
