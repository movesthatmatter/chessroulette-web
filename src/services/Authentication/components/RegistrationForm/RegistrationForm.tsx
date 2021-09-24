import { CountryCode } from 'dstnd-io';
import React from 'react';
import { Button } from 'src/components/Button';
import { Form, FormError, SubmissionErrors } from 'src/components/Form';
import { SelectInput } from 'src/components/Input/SelectInput';
import { Text } from 'src/components/Text';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { validator } from 'src/lib/validator';
import { GetCountries } from 'src/services/Location';
import { colors, onlyMobile } from 'src/theme';
import { AsyncResult } from 'ts-async-results';

export type RegistrationUserInfo =
  | {
      type: 'internal';
      email: string;
    }
  | {
      type: 'external';
      username?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
    };

type Model = {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  countryCode: CountryCode;
};

type Props = {
  userInfo: RegistrationUserInfo;
  onSubmit: (p: Model) => AsyncResult<void, SubmissionErrors<Model>>;
};

export const RegistrationForm: React.FC<Props> = (props) => {
  const cls = useStyles();
  const initialModel =
    props.userInfo.type === 'internal'
      ? {
          email: props.userInfo.email,
          username: '',
          firstName: '',
          lastName: '',
          country: '',
        }
      : {
          email: props.userInfo.email || '',
          username: props.userInfo.username || '',
          firstName: props.userInfo.firstName || '',
          lastName: props.userInfo.lastName || '',
          country: '',
        };

  return (
    <div>
      <div className={cls.infoTextWrapper}>
        <Text size="body1" className={cls.infoText}>
          I see your email is <strong>{props.userInfo.email}</strong> but I need to know a few more things...
        </Text>
      </div>
      <Form<Model>
        validator={{
          email: [validator.rules.email(), validator.messages.email],
          firstName: [validator.rules.name(), validator.messages.firstName],
          lastName: [validator.rules.name(), validator.messages.lastName],
          username: [validator.rules.username(), validator.messages.username],
          countryCode: [validator.rules.notEmpty(), validator.messages.notEmpty],
        }}
        initialModel={initialModel}
        onSubmit={props.onSubmit}
        validateOnChange
        render={(p) => (
          <>
            {/* <TextInput
              label={
                props.userInfo.type === 'internal' && props.userInfo.email.length > 0
                  ? 'I already know your Email'
                  : props.userInfo.email
                  ? 'Is your email correct?'
                  : "What's your email?"
              }
              placeholder="beth.harmon@queens.gambit"
              readOnly
              value={p.model.email}
              onChange={(e) => p.onChange('email', e.target.value)}
              validationError={
                p.errors.validationErrors?.email || p.errors.submissionValidationErrors?.email
              }
            /> */}
            <TextInput
              label="Let's pick a great Username"
              placeholder={p.model.username || "bethHarmon"}
              value={p.model.username}
              onChange={(e) => p.onChange('username', e.target.value)}
              validationError={
                p.errors.validationErrors?.username || p.errors.submissionValidationErrors?.username
              }
            />
            <TextInput
              label={
                props.userInfo.type === 'external' && props.userInfo.firstName
                  ? 'What about your First Name?'
                  : "What's your First Name?"
              }
              placeholder="Beth"
              value={p.model.firstName}
              onChange={(e) => p.onChange('firstName', e.target.value)}
              validationError={
                p.errors.validationErrors?.firstName ||
                p.errors.submissionValidationErrors?.firstName
              }
            />
            <TextInput
              label="And your Last Name?"
              placeholder="Harmon"
              value={p.model.lastName}
              onChange={(e) => p.onChange('lastName', e.target.value)}
              validationError={
                p.errors.validationErrors?.lastName || p.errors.submissionValidationErrors?.lastName
              }
            />
            <GetCountries
              render={({ countries,countriesForDisplay, isLoading, fetch }) => (
                <SelectInput
                  multiple
                  label="Where do you live?"
                  placeholder="Bolivia"
                  options={
                    countries &&
                    countriesForDisplay.map(c => ({
                      label: c.name,
                      value: c.code,
                    }))
                  }
                  isLoading={isLoading}
                  menuPlacement="top"
                  onFocus={() => {
                    if (!(countries || isLoading)) {
                      fetch();
                    }
                  }}
                  // value={}
                  onSelect={({ value }) => p.onChange('countryCode', value)}
                  validationError={
                    p.errors.validationErrors?.countryCode ||
                    p.errors.submissionValidationErrors?.countryCode
                  }
                />
              )}
            />
            {p.errors.submissionGenericError && (
              <FormError message={p.errors.submissionGenericError} />
            )}
            <br />
            <Button label="Create Account" full withLoader onClick={p.submit} />
          </>
        )}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  infoTextWrapper: {
    textAlign: 'center',
    paddingBottom: '24px',

    ...onlyMobile({
      lineHeight: '16px',
      paddingBottom: '12px',
    }),
  },
  infoText: {
    color: colors.neutralDarker,
  },
});
