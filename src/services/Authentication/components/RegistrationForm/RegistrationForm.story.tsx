import { action } from '@storybook/addon-actions';
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
    <RegistrationForm
      userInfo={{}}
      onSubmit={action('on submit')}
    />
  </Grommet>
);
