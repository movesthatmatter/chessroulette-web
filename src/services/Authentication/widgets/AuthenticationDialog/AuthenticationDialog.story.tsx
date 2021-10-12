/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { AuthenticationDialog } from './AuthenticationDialog';

export default {
  component: AuthenticationDialog,
  title: 'services/Authentication/widgets/AuthenticationDialog',
};

export const defaultStory = () => (
    <StorybookReduxProvider>
      <AuthenticationDialog visible />
    </StorybookReduxProvider>
);
