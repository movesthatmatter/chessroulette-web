import { useDispatch, useSelector } from 'react-redux';
import {
  postponeFeedbackDialogAction,
  respondToFeedbackDialogAction,
  attemptToShowFeedbackDialogInviteFriendsStepAction,
  attemptToShowFeedbackDialogAnyStepAction,
  markFriendInviteAsSeenAction,
  closeFeedbackDialogForNowAction,
} from './actions';
import { selectSession } from './selector';
import { SessionState } from './reducer';
import { Events } from '../Analytics';

export const useSession = () => {
  const state: Omit<SessionState, 'feedbackDialog'> = useSelector(selectSession);
  const dispatch = useDispatch();

  const attemptToShowFeedbackDialog = () => {
    dispatch(attemptToShowFeedbackDialogAnyStepAction({ at: new Date() }));
  };

  const attemptToShowFeedbackDialogInviteFriendsStep = () => {
    dispatch(attemptToShowFeedbackDialogInviteFriendsStepAction({ at: new Date() }));
  };

  const postponeFeedback = () => {
    Events.trackRateAndReviewDialogPostponed();

    dispatch(postponeFeedbackDialogAction({ at: new Date() }));
  };

  const respondToFeedbackDialog = (answer: 'negative' | 'neutral' | 'positive') => {
    Events.trackRateAndReviewDialogAnswered(answer);

    dispatch(respondToFeedbackDialogAction({ at: new Date() }));
  };

  const markFriendInviteAsSeen = () => {
    dispatch(markFriendInviteAsSeenAction({ at: new Date() }));
  };

  const closeFeedbackDialogForNow = () => {
    dispatch(closeFeedbackDialogForNowAction({ at: new Date() }));
  };

  return {
    state,
    attemptToShowFeedbackDialog,
    attemptToShowFeedbackDialogInviteFriendsStep,
    postponeFeedback,
    respondToFeedbackDialog,
    markFriendInviteAsSeen,
    closeFeedbackDialogForNow,
  };
};
