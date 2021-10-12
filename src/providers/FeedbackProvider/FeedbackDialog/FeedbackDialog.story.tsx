import { action } from '@storybook/addon-actions';
import React from 'react';
import { FeedbackDialog } from './FeedbackDialog';

export default {
  component: FeedbackDialog,
  title: 'components/FeedbackDialog',
};

export const defaultStory = () => (
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
);
