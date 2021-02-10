import { action } from '@storybook/addon-actions';
import { AsyncResultWrapper, Ok } from 'dstnd-io';
import { delay } from 'fp-ts/lib/Task';
import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { VerificationForm } from './VerificationForm';

export default {
  component: VerificationForm,
  title: 'services/Authentication/components/VerificationForm',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div style={{ width: 420 }}>
      <VerificationForm onSubmit={() => {
        action('on submit')();

        return new AsyncResultWrapper(async () => {
          await delay(2 * 1000);

          return Ok.EMPTY;
        });
      }} />
    </div>
  </Grommet>
);
