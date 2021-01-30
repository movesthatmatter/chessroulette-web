import { action } from '@storybook/addon-actions';
import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { VerificationForm } from './VerificationForm';

export default {
  component: VerificationForm,
  title: 'services/Authentication/components/RegistrationForm',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <VerificationForm onSubmit={action('on submit')} />
  </Grommet>
);
