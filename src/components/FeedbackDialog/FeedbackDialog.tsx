import React, { useEffect, useState } from 'react';
import { RateAndReviewDialog, InviteFriendsDialog, ThankYouDialog } from './components';
import { Rating } from './types';
import { useFeedbackDialog } from './useFeedbackDialog';

type Props = {
  onRated?: (rating: Rating) => void;
  attemptToShowOnMount?: boolean;
};

export const FeedbackDialog: React.FC<Props> = ({ attemptToShowOnMount = false }) => {
  const { state, ...actions } = useFeedbackDialog();
  const [doneRateAndReview, setDoneRateAndReview] = useState(false);
  const feedbackDialog = useFeedbackDialog();

  useEffect(() => {
    if (attemptToShowOnMount) {
      actions.attemptToShow();
    }
  }, []);

  if (doneRateAndReview) {
    return (
      // This should be part of the Rate And Review Component
      <ThankYouDialog
        onClose={() => {
          feedbackDialog.markAllStepsAsSeen();
        }}
      />
    );
  }

  if (state.canShow.steps.rating) {
    return (
      <RateAndReviewDialog
        onPostponed={() => {
          feedbackDialog.markAllStepsAsSeen();
        }}
        onDone={() => setDoneRateAndReview(true)}
      />
    );
  }

  if (state.canShow.steps.friendsInvite) {
    return (
      <InviteFriendsDialog
        onDone={() => {
          feedbackDialog.markStepAsSeen('friendsInvite');
        }}
      />
    );
  }

  return null;
};
