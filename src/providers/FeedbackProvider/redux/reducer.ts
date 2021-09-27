import { createReducer } from 'deox';

import { toISODateTime } from 'src/lib/date/ISODateTime';
import { objectKeys } from 'src/lib/util';
import { GenericStateSlice } from 'src/redux/types';
import { Steps, FeedbackState } from '../types';
import {
  attempToShowAnyStepAction,
  finishStepAction,
  markStepAsSeenAction,
  markAllStepsAsSeenAction,
  posponeStepAction,
  forcefullyShowAllStepsStepsAction,
} from './actions';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer } from 'redux-persist';

const initialState: FeedbackState = {
  // canShow: {
  //   anyStep: false,
  //   steps: {
  //     rating: false,
  //     friendsInvite: false,
  //   },
  // },
  steps: {
    rating: {
      seen: false,
    },
    friendsInvite: {
      seen: false,
    },
  },
};



export const reducer = createReducer(initialState, (handleAction) => [
  handleAction([attempToShowAnyStepAction], (state, { payload }) => {
    return {
      ...state,
      // canShow: getCanShow(state, payload.at),
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
      // canShow: getCanShow(nextState, payload.at),
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
      // canShow: getCanShow(nextState, payload.at),
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
      // canShow: getCanShow(nextState, payload.at),
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
      // canShow: getCanShow(nextState, payload.at),
    };
  }),
]);

const stateSliceByKeyWithoutPersist = {
  feedback: reducer,
};

export const stateSliceByKey = {
  feedback: persistReducer(
    {
      key: 'feedback',
      storage,
    },
    reducer
  ),
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<
  typeof stateSliceByKeyWithoutPersist,
  typeof reducer
>;
