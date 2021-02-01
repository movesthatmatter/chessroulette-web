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
