import { action } from '@storybook/addon-actions';
import { Ok } from 'dstnd-io';
import { delay } from 'fp-ts/lib/Task';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { AsyncResultWrapper } from 'ts-async-results';
import { RegistrationForm } from './RegistrationForm';

export default {
  component: RegistrationForm,
  title: 'services/Authentication/components/RegistrationForm',
};

export const defaultStory = () => (
    <div style={{ maxWidth: 420 }}>
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
);
