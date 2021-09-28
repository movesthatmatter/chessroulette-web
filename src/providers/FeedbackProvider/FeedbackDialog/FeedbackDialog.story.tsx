import { action } from '@storybook/addon-actions';
import { Grommet } from 'grommet';
import React from 'react';
import { defaultTheme } from 'src/theme';
import { FeedbackDialog } from './FeedbackDialog';

export default {
  component: FeedbackDialog,
  title: 'components/FeedbackDialog',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <FeedbackDialog
      attemptToShowOnMount
      attemptToShow={action('attemptToShow')}
      markAllStepsAsSeen={action('markAllStepsAsSeen')}
      markStepAsSeen={action('markStepAsSeen')}
      finishRatingStep={action('finishRatingStep')}
      state={{
        steps: {
          rating: {
            seen: false,
          },
          friendsInvite: {
            seen: false,
          },
        },
      }}
    />
  </Grommet>
);
