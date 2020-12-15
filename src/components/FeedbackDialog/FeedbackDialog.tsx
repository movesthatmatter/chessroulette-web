import React, { useEffect } from 'react';
import { useSession } from 'src/services/Session';
import { RateAndReviewDialog, InviteFriendsDialog } from './components';

type AnswerMood = 'negative' | 'neutral' | 'positive';

type Props = {
  onAnswered?: (mood: AnswerMood) => void;
  attemptToShowOnMount?: boolean;
};

export const FeedbackDialog: React.FC<Props> = ({
  attemptToShowOnMount = false,
}) => {
  const session = useSession();

  useEffect(() => {
    if (attemptToShowOnMount) {
      session.attemptToShowFeedbackDialog();
    }
  }, []);

  if (session.state.canShowFeedbackDialog.steps.feedback) {
    return <RateAndReviewDialog />
  }

  if (session.state.canShowFeedbackDialog.steps.friendsInvite) {
    return <InviteFriendsDialog />
  }

  return null;
};
