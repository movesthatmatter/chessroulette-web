import { action } from '@storybook/addon-actions';
import { AsyncResultWrapper, Err, Ok } from 'dstnd-io';
import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { delay } from 'src/lib/time';
import { validator } from 'src/lib/validator';
import { defaultTheme } from 'src/theme';
import { Button } from '../Button';
import { TextInput } from '../TextInput';
import { FormError } from './components/FormError';
import { Form } from './Form';


export default {
  component: Form,
  title: 'components/Form',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div style={{
      width: '420px',
    }}
    >
      <Form<{
        email: string;
      }>
        onSubmit={() => {
          action('submiting');

          // Wait a bit
          return new AsyncResultWrapper(async () => {
            await delay(2 * 1000);

            return Ok.EMPTY;
          });
        }}
        validator={{
          email: [
            validator.rules.email(),
            validator.messages.email,
          ],
        }}
        render={(p) => (
          <>
            <TextInput
              label="Email"
              onChange={(e) => p.onChange('email', e.target.value)}
              value={p.model.email}
              onBlur={() => p.validateField('email')}
              validationError={p.errors.validationErrors?.email}
            />
            <Button
              label="Submit"
              withLoader
              onClick={p.submit}
            />
          </>
        )}
      />
    </div>
  </Grommet>
);


export const withMultipleFieldsAndpartialModelValidator = () => (
  <Grommet theme={defaultTheme}>
    <div style={{
      width: '420px',
    }}
    >
      <Form<{
        email: string;
        firstName: string;
        lastName: string;
      }>
        onSubmit={() => {
          // Wait a bit
          return new AsyncResultWrapper(async () => {
            await delay(2 * 1000);

            return Ok.EMPTY;
          });
        }}
        validator={{
          email: [
            validator.rules.email(),
            validator.messages.email,
          ],
        }}
        onValidationErrorsUpdated={(errors) => {
          console.log('validtoin errors udpated', errors);
        }}
        render={(p) => (
          <>
            <TextInput
              label="Email"
              onChange={(e) => p.onChange('email', e.target.value)}
              value={p.model.email}
              onBlur={() => p.validateField('email')}
              validationError={p.errors.validationErrors?.email}
            />
            <TextInput
              label="First Name"
              onChange={(e) => p.onChange('firstName', e.target.value)}
              value={p.model.firstName}
              // onBlur={() => p.validateField('firstName')}
              // validationError={p.validationErrors?.email}
            />
            <TextInput
              label="Last Name"
              onChange={(e) => p.onChange('lastName', e.target.value)}
              value={p.model.lastName}
              // onBlur={() => p.validateField('firstName')}
              // validationError={p.validationErrors?.email}
            />
            <Button
              label="Submit"
              withLoader
              onClick={p.submit}
            />
          </>
        )}
      />
    </div>
  </Grommet>
);

export const withMultipleFieldsAndSubmissionValidationErrors = () => (
  <Grommet theme={defaultTheme}>
    <div style={{
      width: '420px',
    }}
    >
      <Form<{
        email: string;
        firstName: string;
        lastName: string;
      }>
        onSubmit={() => {
          console.log('submitting')
          // Wait a bit
          return new AsyncResultWrapper(async () => {
            await delay(1 * 1000);

            return new Err({
              type: 'SubmissionValidationErrors',
              content: {
                fields: {
                  email: 'The email isn\'t correct',
                  firstName: 'The first name isnt valid',
                  lastName: 'The last name isnt valid',
                }
              }
            });
          });
        }}
        validator={{
          // email: [
          //   validator.rules.email(),
          //   validator.messages.email,
          // ],
        }}
        onValidationErrorsUpdated={(errors) => {
          console.log('validtoin errors udpated', errors);
        }}
        render={(p) => (
          <>
            <TextInput
              label="Email"
              onChange={(e) => p.onChange('email', e.target.value)}
              value={p.model.email}
              onBlur={() => p.validateField('email')}
              validationError={p.errors.validationErrors?.email || p.errors.submissionValidationErrors?.email}
            />
            <TextInput
              label="First Name"
              onChange={(e) => p.onChange('firstName', e.target.value)}
              value={p.model.firstName}
              validationError={p.errors.validationErrors?.firstName || p.errors.submissionValidationErrors?.firstName}
              // onBlur={() => p.validateField('firstName')}
              // validationError={p.validationErrors?.email}
            />
            <TextInput
              label="Last Name"
              onChange={(e) => p.onChange('lastName', e.target.value)}
              value={p.model.lastName}
              validationError={p.errors.validationErrors?.lastName || p.errors.submissionValidationErrors?.lastName}
              // onBlur={() => p.validateField('firstName')}
              // validationError={p.validationErrors?.email}
            />
            <Button
              label="Submit"
              withLoader
              onClick={p.submit}
            />
          </>
        )}
      />
    </div>
  </Grommet>
);

export const withFormSubmissionGenericError = () => (
  <Grommet theme={defaultTheme}>
    <div style={{
      width: '420px',
    }}
    >
      <Form<{
        email: string;
        firstName: string;
        lastName: string;
      }>
        onSubmit={() => {
          console.log('submitting')
          // Wait a bit 
          return new AsyncResultWrapper(async () => {
            await delay(1 * 1000);

            return new Err({
              type: 'SubmissionGenericError',
              content: undefined,
            });
          });
        }}
        validator={{
          // email: [
          //   validator.rules.email(),
          //   validator.messages.email,
          // ],
        }}
        onValidationErrorsUpdated={(errors) => {
          console.log('validtion errors udpated', errors);
        }}
        render={(p) => (
          <>
            <TextInput
              label="Email"
              onChange={(e) => p.onChange('email', e.target.value)}
              value={p.model.email}
              onBlur={() => p.validateField('email')}
              validationError={p.errors.validationErrors?.email || p.errors.submissionValidationErrors?.email}
            />
            <TextInput
              label="First Name"
              onChange={(e) => p.onChange('firstName', e.target.value)}
              value={p.model.firstName}
              validationError={p.errors.validationErrors?.firstName || p.errors.submissionValidationErrors?.firstName}
              // onBlur={() => p.validateField('firstName')}
              // validationError={p.validationErrors?.email}
            />
            <TextInput
              label="Last Name"
              onChange={(e) => p.onChange('lastName', e.target.value)}
              value={p.model.lastName}
              validationError={p.errors.validationErrors?.lastName || p.errors.submissionValidationErrors?.lastName}
              // onBlur={() => p.validateField('firstName')}
              // validationError={p.validationErrors?.email}
            />
            {p.errors.submissionGenericError && <FormError message={p.errors.submissionGenericError} />}
            <Button
              label="Submit"
              withLoader
              onClick={p.submit}
            />
          </>
        )}
      />
    </div>
  </Grommet>
);
