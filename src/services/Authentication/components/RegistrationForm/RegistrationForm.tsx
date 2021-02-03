import React from 'react';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { Text } from 'src/components/Text';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { validator } from 'src/lib/validator';
import { colors } from 'src/theme';

export type RegistrationUserInfo = {
  type: 'internal';
  email: string;
} | {
  type: 'external';
  email?: string;
  firstName?: string;
  lastName?: string;
};
type Props = {
  userInfo: RegistrationUserInfo;
  onSubmit: (p: {
    email: string;
    firstName: string;
    lastName: string;
  }) => void;
};

export const RegistrationForm: React.FC<Props> = (props) => {
  const cls = useStyles();

  const initialModel = props.userInfo.type === 'internal'
    ? {
      email: props.userInfo.email,
      firstName: '',
      lastName: '',
    }
    : {
      email: props.userInfo.email || '',
      firstName: props.userInfo.firstName || '',
      lastName: props.userInfo.lastName || '',
    };

  return (
    <div className={cls.container}>
      <div className={cls.infoTextWrapper}>
        <Text size="body1" className={cls.infoText}>
          I just need to know a bit more about you.
        </Text>
      </div>
      <Form<{
        email: string;
        firstName: string;
        lastName: string;
      }>
        validator={{
          email: [validator.rules.email(), validator.messages.email],
          firstName: [validator.rules.name(), validator.messages.firstName],
          lastName: [validator.rules.name(), validator.messages.lastName],
        }}
        initialModel={initialModel}
        onSubmit={props.onSubmit}
        validateOnChange={false}
        render={(p) => (
          <>
            <TextInput
              label={
                (props.userInfo.type === 'internal' && props.userInfo.email.length > 0)
                  ? 'I already know your Email'
                  : props.userInfo.email
                    ? 'Is your email correct?'
                    : 'What\'s your email?'
              }
              placeholder="beth.harmon@queens.gambit"
              readOnly={props.userInfo.type === 'internal' && props.userInfo.email.length > 0}
              value={p.model.email}
              onChange={(e) => p.onChange('email', e.target.value)}
              validationError={p.validationErrors?.email}
            />
            <TextInput
              label={
                (props.userInfo.type === 'external' && props.userInfo.firstName)
                  ? 'What about your First Name?'
                  : 'And what\'s your First Name?'
              }
              placeholder="Beth"
              value={p.model.firstName}
              onChange={(e) => p.onChange('firstName', e.target.value)}
              validationError={p.validationErrors?.firstName}
            />
            <TextInput
              label="Your Last Name?"
              placeholder="Harmon"
              value={p.model.lastName}
              onChange={(e) => p.onChange('lastName', e.target.value)}
              validationError={p.validationErrors?.lastName}
            />
            <Button
              label="Create Account"
              full
              withLoader
              onClick={p.submit}
            />
          </>
        )}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    marginBottom: '-32px',
  },
  infoTextWrapper: {
    textAlign: 'center',
    paddingBottom: '24px',
  },
  infoText: {
    color: colors.neutralDarker,
  },
});
