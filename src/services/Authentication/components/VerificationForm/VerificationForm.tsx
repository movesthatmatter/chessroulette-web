import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { Hr } from 'src/components/Hr';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { LichessAuthButton } from 'src/vendors/lichess/LichessAuthButton';
import { UserAccountInfo } from '../../types';
import { Form } from 'src/components/Form';
import { validator } from 'src/lib/validator';
import * as resources from '../../resources';
import { CodeInput } from 'src/components/CodeInput';
import { Text } from 'src/components/Text';
import { colors } from 'src/theme';
import { Emoji } from 'src/components/Emoji';
import { FacebookAuthButton } from 'src/vendors/facebook/FacebookAuthButton/FacebookAuthButton';


type Props = {
  onSubmit: (r: UserAccountInfo) => void;
};

const splitName = (name: string) => {
  const splitName = name?.split(' ') || [];

  return {
    first: splitName[0],
    last: splitName.slice(-1)[0],
  }
}

export const VerificationForm: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [emailToBeVerified, setEmailToBeVerified] = useState<string>();

  return (
    <div className={cls.container}>
      {emailToBeVerified ? (
        <Form<{
          code: string;
        }>
          key="code-verification-form"
          onSubmit={(model) => {
            return props.onSubmit({
              type: 'internal',
              email: emailToBeVerified,
              verificationCode: model.code, // TODO: Add the code too when I do the verification
            });
          }}
          validateOnChange
          validator={{
            code: [validator.rules.digits(5), 'The Code isn\'t valid'],
          }}
          render={(p) => (
            <>
              <div className={cls.infoTextWrapper}>
                <Text size="body1" className={cls.infoText}>
                  I just sent you an email at <strong>{emailToBeVerified}</strong> with a code!<br/> You know what to do <Emoji symbol="😎" />
                </Text>
              </div>
              <CodeInput
                onChange={(input) => {
                  p.onChange('code', input);
                }}
                fieldSize={45}
              />
              <Button
                label="Verify"
                full
                type="positive"
                disabled={!p.canSubmit} // TODO: check if email!
                withLoader
                onClick={p.submit}
              />
            </>
          )}
        />
      ) : (
        <Form<{
          email: string;
        }>
          key="email-form"
          onSubmit={async (model) => {
            return resources
              .verifyEmail(model)
              .map(() => setEmailToBeVerified(model.email))
              .resolve();
          }}
          validator={{
            email: [validator.rules.email(), validator.messages.email],
          }}
          render={(p) => (
            <>
              <TextInput
                key="email"
                label="What's your Email?"
                placeholder="beth.harmon@queens.gambit"
                onChange={(e) => p.onChange('email', e.target.value)}
                onBlur={() => p.validateField('email')}
                validationError={p.validationErrors?.email}
              />
              <Button
                label="Send Email"
                full
                type="positive"
                withLoader
                onClick={p.submit}
              />
            </>
          )}
        />
      )}
      <Hr text="Or Continue With" />
      <div className={cls.buttonRow}>
        <LichessAuthButton
          full
          label="Lichess"
          type="secondary"
          onSuccess={(accessToken) => {
            props.onSubmit({
              type: 'external',
              vendor: 'lichess',
              accessToken,
            });
          }}
        />
        <div style={{ width: '16px' }} />
        <FacebookAuthButton
          label="Facebook"
          full
          onSuccess={(accessToken) => {
            props.onSubmit({
              type: 'external',
              vendor: 'facebook',
              accessToken,
            });
          }}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    marginBottom: '-32px',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: '16px',
  },
  infoTextWrapper: {
    textAlign: 'center',
    paddingBottom: '24px',
  },
  infoText: {
    color: colors.neutralDarker,
  },
  errorMessageWrapper: {
    color: colors.negativeLight,
    paddingLeft: '12px',
  },
});