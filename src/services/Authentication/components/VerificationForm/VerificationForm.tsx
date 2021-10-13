import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { Hr } from 'src/components/Hr';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { LichessAuthButton } from 'src/vendors/lichess/LichessAuthButton';
import { UserAccountInfo } from '../../types';
import { Form, FormError, SubmissionErrors } from 'src/components/Form';
import { validator } from 'src/lib/validator';
import * as resources from '../../resources';
import { CustomTheme } from 'src/theme';
import { FacebookAuthButton } from 'src/vendors/facebook/FacebookAuthButton/FacebookAuthButton';
import { CodeVerificationForm } from '../CodeVerificationForm';
import { Emoji } from 'src/components/Emoji';
import { TwitchAuthButton } from 'src/vendors/twitch/TwitchAuthButton/TwitchAuthButton';
import { spacers } from 'src/theme/spacers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import { AsyncResult } from 'ts-async-results';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';

type Model = {
  code: string;
};

type Props = {
  onSubmit: (r: UserAccountInfo) => AsyncResult<void, SubmissionErrors<Model>>;
  // onSubmit: (r: UserAccountInfo) => void;
};

export const VerificationForm: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [emailToBeVerified, setEmailToBeVerified] = useState<string>();
  const {theme} = useColorTheme();

  return (
    <div>
      {emailToBeVerified ? (
        <CodeVerificationForm
          emailToBeVerified={emailToBeVerified}
          onSubmit={props.onSubmit}
          infoText={
            <>
              I just sent you an email at <strong>{emailToBeVerified}</strong>
              {` `} with a code!
              <br /> You know what to do <Emoji symbol="😎" />
            </>
          }
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
                };
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
                onChange={(e) => p.onChange('email', e.currentTarget.value)}
                onBlur={() => p.validateField('email')}
                validationError={
                  p.errors.validationErrors?.email || p.errors.submissionValidationErrors?.email
                }
              />
              {p.errors.submissionGenericError && (
                <FormError message={p.errors.submissionGenericError} />
              )}
              <div style={{ paddingBottom: '6px' }} />
              <Button
                label="Send Verification"
                full
                type={theme.name === 'lightDefault' ? "positive" : 'primary'}
                withLoader
                onClick={p.submit}
              />
            </>
          )}
        />
      )}
      <Hr text="Or Continue With" />
      <div className={cls.buttonRows}>
        <LichessAuthButton
          full
          label="Lichess"
          type="secondary"
          className={cls.lichess}
          onSuccess={(accessToken) => {
            props.onSubmit({
              type: 'external',
              vendor: 'lichess',
              accessToken,
            });
          }}
        />
        <TwitchAuthButton
          full
          label="Twitch"
          type="primary"
          onSuccess={(accessToken) => {
            props.onSubmit({
              type: 'external',
              vendor: 'twitch',
              accessToken,
            });
          }}
          className={cls.twitch}
          style={{ background: '#6441a5 !important' }}
          icon={() => <FontAwesomeIcon icon={faTwitch} color={theme.colors.white} size="lg" />}
          iconWrapperStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0)',
            padding: '0px',
          }}
        />
        <div style={{ height: spacers.smallPx }} />
        {/* <div style={{ width: '16px' }} />
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
        /> */}
      </div>
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  buttonRows: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: '16px',
  },
  infoTextWrapper: {
    textAlign: 'center',
    paddingBottom: '24px',
  },
  infoText: {
    color: theme.colors.neutralDarker,
  },
  twitch: {
    background: '#6441a5 !important' 
  },
  lichess: {
    ...(theme.name === 'darkDefault' && {
      ...makeImportant({
        background: '#CF1484',
      })
    })
  }
}));
