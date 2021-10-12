import { action } from '@storybook/addon-actions';
import { delay } from 'fp-ts/lib/Task';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { AsyncResultWrapper } from 'ts-async-results';
import { Ok } from 'ts-results';
import { VerificationForm } from './VerificationForm';

export default {
  component: VerificationForm,
  title: 'services/Authentication/components/VerificationForm',
};

export const defaultStory = () => (
    <div style={{ width: 420 }}>
      <VerificationForm onSubmit={() => {
        action('on submit')();

        return new AsyncResultWrapper(async () => {
          await delay(2 * 1000);

          return Ok.EMPTY;
        });
      }} />
    </div>
);
