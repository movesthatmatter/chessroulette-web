import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { defaultTheme } from 'src/theme';
import { FeedbackDialog } from './FeedbackDialog';

export default {
  component: FeedbackDialog,
  title: 'components/FeedbackDialog',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <StorybookReduxProvider>
      <FeedbackDialog attemptToShowOnMount />
    </StorybookReduxProvider>
  </Grommet>
);
