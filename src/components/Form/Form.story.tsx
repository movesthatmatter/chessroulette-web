import { action } from '@storybook/addon-actions';
import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { delay } from 'src/lib/time';
import { validator } from 'src/lib/validator';
import { defaultTheme } from 'src/theme';
import { Button } from '../Button';
import { TextInput } from '../TextInput';
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
          return delay(2 * 1000);
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
              validationError={p.validationErrors?.email}
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
          return delay(2 * 1000).then(action('submited'));
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
              validationError={p.validationErrors?.email}
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
