import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { Hr } from 'src/components/Hr';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { LichessAuthButton } from 'src/vendors/lichess/LichessAuthButton';
import { UserAccountInfo } from '../../types';
import { Form, FormError, SubmissionErrors } from 'src/components/Form';
import { validator } from 'src/lib/validator';
import * as resources from '../../resources';
import { colors } from 'src/theme';
import { FacebookAuthButton } from 'src/vendors/facebook/FacebookAuthButton/FacebookAuthButton';
import { AsyncResult } from 'dstnd-io';
import { CodeVerificationForm } from '../CodeVerificationForm';
import { Text } from 'src/components/Text';
import { Emoji } from 'src/components/Emoji';


type Model = {
  code: string;
}

type Props = {
  onSubmit: (r: UserAccountInfo) => AsyncResult<void, SubmissionErrors<Model>>;
  // onSubmit: (r: UserAccountInfo) => void;
};

export const VerificationForm: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [emailToBeVerified, setEmailToBeVerified] = useState<string>();

  return (
    <div>
      {emailToBeVerified
        ? (
          <CodeVerificationForm
            emailToBeVerified={emailToBeVerified}
            onSubmit={props.onSubmit}
            infoText={(
              <>
                I just sent you an email at <strong>{emailToBeVerified}</strong>
                {` `} with a code!<br /> You know what to do <Emoji symbol="😎" />
              </>
            )}
          />
        ) : (
          <Form<{
            email: string;
          }>
            key="email-form"
            onSubmit={(model) => {
              return resources
                .verifyEmail(model)
                .map(() => setEmailToBeVerified(model.email))
                .mapErr((e) => {
                  if (e.type === 'ValidationErrors') {
                    return {
                      type: 'SubmissionValidationErrors',
                      content: e.content,
                    };
                  }

                  if (e.type === 'EmailCantSendError') {
                    return {
                      type: 'SubmissionGenericError',
                      content: `Ooops – This one's on me! I couldn't send you email now but please try again in a few moments.`,
                    };
                  }

                  return {
                    type: 'SubmissionGenericError',
                    content: e.content,
                  }
                });
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
                  validationError={
                    p.errors.validationErrors?.email || p.errors.submissionValidationErrors?.email
                  }
                />
                {p.errors.submissionGenericError && <FormError message={p.errors.submissionGenericError} />}
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
});