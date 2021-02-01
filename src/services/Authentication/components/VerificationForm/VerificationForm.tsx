import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/Button';
import { Hr } from 'src/components/Hr';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { useFacebookLogin } from 'react-use-fb-login';
import { LichessAuthButton } from 'src/vendors/lichess/LichessAuthButton';
import config from 'src/config';
import { keyInObject } from 'src/lib/util';
import { UserAccountInfo } from '../../types';
import { Form } from 'src/components/Form';
import { validator } from 'src/lib/validator';
import * as resources from '../../resources';
import { CodeInput } from 'src/components/CodeInput';
import { Text } from 'src/components/Text';
import { colors } from 'src/theme';
import { Emoji } from 'src/components/Emoji';


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

  // const [model, setModel] = useState({
  //   email: '',
  // })
  // const [validationErros, setValidationErrors] = useState({
  //   email: undefined,
  // });

  // TODO: Here the email needs to be verified, by default!
  //  The Code Input will be shown by default, with a message to
  //  check their email. Regardless if the email exists in the DB
  //  or not. This is to avoid hackers checking if other users have an account!

  const [fbState, fbLogin] = useFacebookLogin({
    appId: config.FACEBOOK.APP_ID,
    language: 'EN',
    version: '3.1',
    fields: ['id', 'email', 'name', 'picture' as any],
    onFailure: error => {
      console.log(error);
    }
  });

  useEffect(() => {
    if (
      fbState.currentUser
      && keyInObject(fbState.currentUser, 'id')
      && keyInObject(fbState.currentUser, 'email')
      && keyInObject(fbState.currentUser, 'name')
    ) {
      const name = splitName(fbState.currentUser.name || '');

      props.onSubmit({
        type: 'external',
        externalVendor: 'facebook',
        email: fbState.currentUser.email as string,
        externalUserId: fbState.currentUser.id as string,
        firstName: name.first,
        lastName: name.last,
      });
    }
  }, [fbState.currentUser])

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
                  I just sent you an email with a code!<br/> You know what to do <Emoji symbol="😎" />
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
                // value={model.email}
                onChange={(e) => p.onChange('email', e.target.value)}
                onBlur={() => p.validateField('email')}
                validationError={p.validationErrors?.email}
              />
              <Button
                label="Send Email"
                full
                type="positive"
                // disabled={model.email.length === 0} // TODO: check if email!
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
          onSuccess={(r) => {
            props.onSubmit({
              type: 'external',
              externalVendor: 'lichess',
              email: r.email,
              externalUserId: r.id,

              // Since Lichess doesn't return a name the User will have to input it!
              firstName: undefined,
              lastName: undefined,
            });
          }}
        />
        <div style={{ width: '16px' }} />
        <Button
          label="Facebook"
          type="primary"
          full
          onClick={fbLogin}
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