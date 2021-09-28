import React, { useEffect, useState } from 'react';
import { RateAndReviewDialog, InviteFriendsDialog, ThankYouDialog } from './components';
import { FeedbackState, Rating, StepName } from '../types';

type Props = {
  onRated?: (rating: Rating) => void;
  attemptToShowOnMount?: boolean;
  state: FeedbackState;
  markAllStepsAsSeen: () => void;
  attemptToShow: () => void;
  markStepAsSeen: (step: StepName) => void;
  finishRatingStep: (rating: Rating) => void;
};

export const FeedbackDialog: React.FC<Props> = ({
  state,
  attemptToShowOnMount = false,
  ...actions
}) => {
  const [doneRateAndReview, setDoneRateAndReview] = useState(false);

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
          actions.markAllStepsAsSeen();
        }}
      />
    );
  }

  // if (state.canShow.steps.friendsInvite) {
  //   return (
  //     <InviteFriendsDialog
  //       onDone={() => {
  //         actions.markStepAsSeen('friendsInvite');
  //       }}
  //     />
  //   );
  // }

  // Taken out on Sep 15th
  return (
    <RateAndReviewDialog
      onPostponed={() => {
        actions.markAllStepsAsSeen();
      }}
      onDone={(rating) => {
        actions.finishRatingStep(rating);
        setDoneRateAndReview(true);
      }}
    />
  );
};
