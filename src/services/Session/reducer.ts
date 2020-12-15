import { createReducer } from 'deox';
import { ISODateTime } from 'io-ts-isodatetime';
import { ISODateTimeToTimestamp } from 'src/lib/date';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { days, hours } from 'src/lib/time';
import { GenericStateSlice } from 'src/redux/types';
import {
  attemptToShowFeedbackDialogAnyStepAction,
  attemptToShowFeedbackDialogInviteFriendsStepAction,
  closeFeedbackDialogForNowAction,
  markFriendInviteAsSeenAction,
  postponeFeedbackDialogAction,
  respondToFeedbackDialogAction,
} from './actions';

type SeenState =
  | {
      seen: false;
    }
  | {
      seen: true;
      lastSeenAt: ISODateTime;
      done: boolean;
    };

export type SessionState = {
  canShowFeedbackDialog: {
    anyStep: boolean;
    steps: {
      feedback: boolean;
      friendsInvite: boolean;
    };
  };
  feedbackDialog: {
    steps: {
      feedback: SeenState;
      friendsInvite: SeenState;
    };
  };
};

const initialState: SessionState = {
  canShowFeedbackDialog: {
    anyStep: false,
    steps: {
      feedback: false,
      friendsInvite: false,
    },
  },
  feedbackDialog: {
    steps: {
      feedback: {
        seen: false,
      },
      friendsInvite: {
        seen: false,
      },
    },
  },
};

const FEEDBACK_DIALOG_POSTPONING_TIME = {
  feedback: hours(24),
  friendsInvite: days(7),
};

const getCanShowFeedbackDialogStep = (
  step: SessionState['feedbackDialog']['steps'][keyof SessionState['feedbackDialog']['steps']],
  at: Date,
  waitTimeMs: number
) => {
  return (
    step.seen === false ||
    (step.done === false && ISODateTimeToTimestamp(step.lastSeenAt) + waitTimeMs < at.getTime())
  );
};

const getCanShowFeedbackDialog = (
  state: SessionState,
  at: Date
): SessionState['canShowFeedbackDialog'] => {
  const canShowFeedback = getCanShowFeedbackDialogStep(
    state.feedbackDialog.steps.feedback,
    at,
    FEEDBACK_DIALOG_POSTPONING_TIME.feedback
  );

  const canShowFriendsInvite = getCanShowFeedbackDialogStep(
    state.feedbackDialog.steps.friendsInvite,
    at,
    FEEDBACK_DIALOG_POSTPONING_TIME.friendsInvite
  );

  return {
    anyStep: canShowFeedback || canShowFriendsInvite,
    steps: {
      feedback: canShowFeedback,
      friendsInvite: canShowFriendsInvite,
    },
  };
};

export const reducer = createReducer(initialState, (handleAction) => [
  handleAction(attemptToShowFeedbackDialogAnyStepAction, (state, { payload }) => {
    return {
      ...state,
      canShowFeedbackDialog: getCanShowFeedbackDialog(state, payload.at),
    };
  }),
  handleAction(attemptToShowFeedbackDialogInviteFriendsStepAction, (state, { payload }) => {
    return {
      ...state,
      canShowFeedbackDialog: getCanShowFeedbackDialog(state, payload.at),
    };
  }),
  handleAction(postponeFeedbackDialogAction, (state, { payload }) => {
    const nextState: SessionState = {
      ...state,
      feedbackDialog: {
        steps: {
          ...state.feedbackDialog.steps,
          feedback: {
            seen: true,
            done: false,
            lastSeenAt: toISODateTime(payload.at),
          },
        },
      },
    };

    return {
      ...nextState,
      canShowFeedbackDialog: getCanShowFeedbackDialog(nextState, payload.at),
    };
  }),
  handleAction(respondToFeedbackDialogAction, (state, { payload }) => {
    const nextState: SessionState = {
      ...state,
      feedbackDialog: {
        steps: {
          ...state.feedbackDialog.steps,
          feedback: {
            seen: true,
            done: true,
            lastSeenAt: toISODateTime(payload.at),
          },
        },
      },
    };

    return {
      ...nextState,
      canShowFeedbackDialog: getCanShowFeedbackDialog(nextState, payload.at),
    };
  }),
  handleAction(closeFeedbackDialogForNowAction, (state, { payload }) => {
    const { feedback, friendsInvite } = state.feedbackDialog.steps;
    const nextFeedbackStep: SeenState =
      feedback.seen && feedback.done
        ? feedback
        : {
            seen: true,
            lastSeenAt: toISODateTime(payload.at),
            done: false,
          };

    const nextFriendsInviteStep: SeenState =
      friendsInvite.seen && friendsInvite.done
        ? friendsInvite
        : {
            seen: true,
            lastSeenAt: toISODateTime(payload.at),
            done: false,
          };

    const nextState: SessionState = {
      ...state,
      feedbackDialog: {
        steps: {
          feedback: nextFeedbackStep,
          friendsInvite: nextFriendsInviteStep,
        },
      },
    }
    return {
      ...nextState,
      canShowFeedbackDialog: getCanShowFeedbackDialog(nextState, payload.at),
    };
  }),

  handleAction(markFriendInviteAsSeenAction, (state, { payload }) => {
    const nextState: SessionState = {
      ...state,
      feedbackDialog: {
        steps: {
          ...state.feedbackDialog.steps,
          friendsInvite: {
            seen: true,

            // This is never done as we want to promote the friends invite!
            done: false,
            lastSeenAt: toISODateTime(payload.at),
          },
        },
      },
    };

    return {
      ...nextState,
      canShowFeedbackDialog: getCanShowFeedbackDialog(nextState, payload.at),
    };
  }),
]);

export const stateSliceByKey = {
  session: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
