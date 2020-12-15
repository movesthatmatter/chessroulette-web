import { createAction } from 'deox';

export const attemptToShowFeedbackDialogAnyStepAction = createAction(
  'Attempt To Show Feedback Dialog: Any Step',
  (resolve) => (p: { at: Date }) => resolve(p),
);

export const attemptToShowFeedbackDialogInviteFriendsStepAction = createAction(
  'Attempt To Show Feedback Dialog: Invite Friends Step',
  (resolve) => (p: { at: Date }) => resolve(p)
);

// export const attemptToShowFeedbackDialogAction = createAction(
//   'Attempt To Show Feedback Dialog',
//   (resolve) => (p: { at: Date }) => resolve(p)
// );
export const postponeFeedbackDialogAction = createAction(
  'Postpone Feedback Dialog',
  (resolve) => (p: { at: Date }) => resolve(p),
);
export const respondToFeedbackDialogAction = createAction(
  'Respond To Feedback Dialog',
  (resolve) => (p: { at: Date }) => resolve(p),
);

export const markFriendInviteAsSeenAction = createAction(
  'Mark Friends Invite as Seen',
  (resolve) => (p: { at: Date }) => resolve(p),
);

export const closeFeedbackDialogForNowAction = createAction(
  'Close Feedback Dialog For Now Action',
  (resolve) => (p: { at: Date }) => resolve(p),
);