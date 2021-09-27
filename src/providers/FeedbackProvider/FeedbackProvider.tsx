import React, { useState, useEffect, useCallback } from 'react';
import { now } from 'src/lib/date';
import { FeedbackDialog } from './FeedbackDialog/FeedbackDialog';
import { getCanShow } from './util';
import { FeedbackDialogContext, FeedbackDialogContextState } from './FeedbackContext';
import { useDispatch, useSelector } from 'react-redux';
import { Events } from 'src/services/Analytics';
import {
  attempToShowAnyStepAction,
  finishStepAction,
  forcefullyShowAllStepsStepsAction,
  markAllStepsAsSeenAction,
  markStepAsSeenAction,
  posponeStepAction,
} from './redux/actions';
import { selectFeedback } from './redux/selector';
import { Rating, StepName } from './types';

type Props = {};

export const FeedbackProvider: React.FC<Props> = (props) => {
  const state = useSelector(selectFeedback);
  const dispatch = useDispatch();

  const attemptToShow = () => {
    dispatch(attempToShowAnyStepAction({ at: new Date() }));
  };

  const forcefullyShowAllSteps = () => {
    dispatch(forcefullyShowAllStepsStepsAction({ at: new Date() }));
  };

  // const postponeStep = (step: StepName) => {
  //   dispatch(posponeStepAction({ at: new Date(), step }));

  //   Events.trackFeedbackDialogPostponed([

  //   ]);
  // };

  const finishRatingStep = (rating: Rating) => {
    dispatch(
      finishStepAction({
        step: 'rating',
        at: new Date(),
      })
    );

    Events.trackFeedbackDialogRated(rating);
  };

  const markStepAsSeen = (step: StepName) => {
    dispatch(
      markStepAsSeenAction({
        step,
        at: new Date(),
      })
    );
  };

  const markAllStepsAsSeen = () => {
    dispatch(markAllStepsAsSeenAction({ at: new Date() }));
  };

  const attemptToShowIfPossible = useCallback(() => {
    const canShow = getCanShow(state, now());

    // TODO: Right now I'm checking if the rating can be shown
    //  and not considering the other steps, since this is the first
    //  byt this might need to change
    if (!canShow.steps.rating) {
      return;
    }

    setContextState((prev) => ({
      ...prev,
      visible: true,
    }));
  }, [state]);

  const [contextState, setContextState] = useState<FeedbackDialogContextState>({
    visible: false,
    attemptToShowIfPossible,
    forcefullyShow: () => {
      setContextState((prev) => ({
        ...prev,
        visible: true,
      }));
    },
  });

  useEffect(() => {
    setContextState((prev) => ({
      ...prev,
      attemptToShowIfPossible,
    }));
  }, [attemptToShowIfPossible]);

  useEffect(() => {
    setContextState((prev) => ({
      ...prev,
      visible: prev.visible && getCanShow(state, now()).anyStep,
    }));
  }, [state])

  return (
    <FeedbackDialogContext.Provider value={contextState}>
      {props.children}
      {contextState.visible && (
        <FeedbackDialog
          state={state}
          markAllStepsAsSeen={markAllStepsAsSeen}
          markStepAsSeen={markStepAsSeen}
          finishRatingStep={finishRatingStep}
          attemptToShow={attemptToShow}
        />
      )}
    </FeedbackDialogContext.Provider>
  );
};
