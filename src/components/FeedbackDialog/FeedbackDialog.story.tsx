/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { FeedbackDialog } from './FeedbackDialog';

export default {
  component: FeedbackDialog,
  title: 'components/FeedbackDialog',
};

export const defaultStory = () => (
    <StorybookReduxProvider>
      <FeedbackDialog attemptToShowOnMount />
    </StorybookReduxProvider>
);
