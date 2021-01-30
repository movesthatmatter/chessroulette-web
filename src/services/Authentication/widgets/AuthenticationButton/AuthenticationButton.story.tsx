import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { AuthenticationButton } from './AuthenticationButton';

export default {
  component: AuthenticationButton,
  title: 'services/Authentication/widgets/AuthenticationButton',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <AuthenticationButton />
  </Grommet>
);