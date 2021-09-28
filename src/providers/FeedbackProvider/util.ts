import { ISODateTimeToTimestamp } from 'src/lib/date';
import { days, hours } from 'src/lib/time';
import { FeedbackState, FeedbackStateCanShow, StepName, Steps } from './types';

// TODO: This should come from a Config somewhere
const FEEDBACK_DIALOG_POSTPONING_TIME = {
  feedback: hours(24),
  friendsInvite: days(7),
};

const getCanShowFeedbackDialogStep = (step: Steps[StepName], at: Date, waitTimeMs: number) => {
  return (
    step.seen === false ||
    (step.done === false && ISODateTimeToTimestamp(step.lastSeenAt) + waitTimeMs < at.getTime())
  );
};

export const getCanShow = (state: FeedbackState, at: Date): FeedbackStateCanShow => {
  const canShowRatingStep = getCanShowFeedbackDialogStep(
    state.steps.rating,
    at,
    FEEDBACK_DIALOG_POSTPONING_TIME.feedback
  );

  const canShowFriendsInviteStep = getCanShowFeedbackDialogStep(
    state.steps.friendsInvite,
    at,
    FEEDBACK_DIALOG_POSTPONING_TIME.friendsInvite
  );

  return {
    anyStep: canShowRatingStep || canShowFriendsInviteStep,
    steps: {
      rating: canShowRatingStep,
      friendsInvite: canShowFriendsInviteStep,
    },
  };
};
