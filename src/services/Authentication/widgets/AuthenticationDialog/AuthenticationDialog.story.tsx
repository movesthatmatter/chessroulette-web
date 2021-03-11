import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { defaultTheme } from 'src/theme';
import { AuthenticationDialog } from './AuthenticationDialog';

export default {
  component: AuthenticationDialog,
  title: 'services/Authentication/widgets/AuthenticationDialog',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <StorybookReduxProvider>
      <AuthenticationDialog visible />
    </StorybookReduxProvider>
  </Grommet>
);
