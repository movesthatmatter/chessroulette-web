import React, { ReactNode } from 'react';
import { Button } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { UserAccountInfo } from '../../types';
import { Form, FormError, SubmissionErrors } from 'src/components/Form';
import { validator } from 'src/lib/validator';
import { CodeInput } from 'src/components/CodeInput';
import { Text } from 'src/components/Text';
import { colors } from 'src/theme';
import { Emoji } from 'src/components/Emoji';
import { AsyncResult } from 'dstnd-io';


type Props = {
  onSubmit: (r: UserAccountInfo) => AsyncResult<void, SubmissionErrors<Model>>;
  emailToBeVerified: string;
  infoText: ReactNode;
};

type Model = {
  code: string;
}

export const CodeVerificationForm: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <Form<Model>
      key="code-verification-form"
      onSubmit={(model) => {
        return props.onSubmit({
          type: 'internal',
          email: props.emailToBeVerified,
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
              {props.infoText}
            </Text>
          </div>
          <CodeInput
            onChange={(input) => {
              p.onChange('code', input);
            }}
            // onComplete={debounce(p.submit, 250)}
            fieldSize={45}
          />
          {(p.errors.submissionGenericError || p.errors.submissionValidationErrors?.code) && (
            <FormError
              message={p.errors.submissionGenericError || p.errors.submissionValidationErrors?.code || ''}
            />
          )}
          <div style={{ paddingBottom: '16px' }} />
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
  );
};

const useStyles = createUseStyles({
  infoTextWrapper: {
    textAlign: 'center',
    paddingBottom: '24px',
  },
  infoText: {
    color: colors.neutralDarker,
  },
});