/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { AuthenticationButton } from './AuthenticationButton';

export default {
  component: AuthenticationButton,
  title: 'services/Authentication/widgets/AuthenticationButton',
};

export const defaultStory = () => (
    <StorybookReduxProvider>
      <AuthenticationButton />
    </StorybookReduxProvider>
);
