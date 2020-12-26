import { createReducer } from 'deox';
import { ISODateTimeToTimestamp } from 'src/lib/date';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { days, hours } from 'src/lib/time';
import { objectKeys } from 'src/lib/util';
import { GenericStateSlice } from 'src/redux/types';
import { StepName, Steps } from './types';
import {
  attempToShowAnyStepAction,
  finishStepAction,
  markStepAsSeenAction,
  markAllStepsAsSeenAction,
  posponeStepAction,
  forcefullyShowAllStepsStepsAction,
} from './actions';
import { FeedbackState } from './types';

const initialState: FeedbackState = {
  canShow: {
    anyStep: false,
    steps: {
      rating: false,
      friendsInvite: false,
    },
  },
  steps: {
    rating: {
      seen: false,
    },
    friendsInvite: {
      seen: false,
    },
  },
};

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

const getCanShow = (state: FeedbackState, at: Date): FeedbackState['canShow'] => {
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

export const reducer = createReducer(initialState, (handleAction) => [
  handleAction([attempToShowAnyStepAction], (state, { payload }) => {
    return {
      ...state,
      canShow: getCanShow(state, payload.at),
    };
  }),
  handleAction([forcefullyShowAllStepsStepsAction], (state, { payload }) => {
    return {
      ...state,
      canShow: {
        anyStep: true,
        steps: {
          rating: true,
          friendsInvite: true,
        },
      },
    };
  }),
  handleAction(posponeStepAction, (state, { payload }) => {
    const step = state.steps[payload.step];

    // If it's already done there's nothing to postpone
    if (step.seen && step.done) {
      return state;
    }

    const nextState: FeedbackState = {
      ...state,
      steps: {
        ...state.steps,
        [payload.step]: {
          seen: true,
          done: false,
          lastSeenAt: toISODateTime(payload.at),
        },
      },
    };

    return {
      ...nextState,
      canShow: getCanShow(nextState, payload.at),
    };
  }),
  handleAction(markStepAsSeenAction, (state, { payload }) => {
    const nextStep = {
      ...[state.steps[payload.step]],
      seen: true,
      lastSeenAt: toISODateTime(payload.at),
    };

    const nextState: FeedbackState = {
      ...state,
      steps: {
        ...state.steps,
        [payload.step]: nextStep,
      },
    };

    return {
      ...nextState,
      canShow: getCanShow(nextState, payload.at),
    };
  }),
  handleAction(finishStepAction, (state, { payload }) => {
    const nextState: FeedbackState = {
      ...state,
      steps: {
        ...state.steps,
        [payload.step]: {
          seen: true,
          done: true,
          lastSeenAt: toISODateTime(payload.at),
        },
      },
    };

    return {
      ...nextState,
      canShow: getCanShow(nextState, payload.at),
    };
  }),
  handleAction(markAllStepsAsSeenAction, (state, { payload }) => {
    const nextSteps = objectKeys(state.steps).reduce((prev, stepName) => {
      const prevStep = state.steps[stepName];
      return {
        ...prev,
        [stepName]:
          prevStep.seen && prevStep.done
            ? prevStep
            : {
                seen: true,
                lastSeenAt: toISODateTime(payload.at),
                done: false,
              },
      };
    }, {} as Steps);

    const nextState: FeedbackState = {
      ...state,
      steps: nextSteps,
    };
    return {
      ...nextState,
      canShow: getCanShow(nextState, payload.at),
    };
  }),
]);

export const stateSliceByKey = {
  feedbackDialog: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
