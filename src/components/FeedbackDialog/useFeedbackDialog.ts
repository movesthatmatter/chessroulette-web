import { useDispatch, useSelector } from 'react-redux';
import { Events } from 'src/services/Analytics';
import {
  attempToShowAnyStepAction,
  finishStepAction,
  markAllStepsAsSeenAction,
  markStepAsSeenAction,
  posponeStepAction,
} from './actions';
import { selectFeedback } from './selector';
import { Rating, StepName } from './types';

export const useFeedbackDialog = () => {
  const state = useSelector(selectFeedback);
  const dispatch = useDispatch();

  const attemptToShow = () => {
    dispatch(attempToShowAnyStepAction({ at: new Date() }));
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

  return {
    state,
    attemptToShow,
    markStepAsSeen,
    markAllStepsAsSeen,
    finishRatingStep,
  };
};
