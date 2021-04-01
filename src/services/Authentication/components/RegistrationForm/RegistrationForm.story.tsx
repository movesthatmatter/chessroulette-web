import { action } from '@storybook/addon-actions';
import { AsyncResultWrapper, Ok } from 'dstnd-io';
import { delay } from 'fp-ts/lib/Task';
import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { RegistrationForm } from './RegistrationForm';

export default {
  component: RegistrationForm,
  title: 'services/Authentication/components/RegistrationForm',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div style={{ width: 420 }}>
      <RegistrationForm
        userInfo={{
          type: 'internal',
          email: 'sample@email.com',
        }}
        onSubmit={() => {
          action('on submit')();

          return new AsyncResultWrapper(async () => {
            await delay(2 * 1000);

            return Ok.EMPTY;
          });
        }}
      />
    </div>
  </Grommet>
);
