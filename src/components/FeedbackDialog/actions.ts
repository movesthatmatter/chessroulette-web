import { createAction } from 'deox';
import { StepName } from './types';

export const attempToShowAnyStepAction = createAction(
  'Feedback Dialog: Attempt To Show Any Step',
  (resolve) => (p: { at: Date }) => resolve(p)
);

export const forcefullyShowAllStepsStepsAction = createAction(
  'Feedback Dialog: Forcefully Show All Steps',
  (resolve) => (p: { at: Date }) => resolve(p)
);

export const posponeStepAction = createAction(
  'Feedback Dialog: Pospone Step',
  (resolve) => (p: { step: StepName, at: Date }) => resolve(p)
);
export const finishStepAction = createAction(
  'Feedback Dialog: Finish Step',
  (resolve) => (p: { step: StepName, at: Date }) => resolve(p)
);

export const markStepAsSeenAction = createAction(
  'Feedback Dialog: Mark Step As Seen',
  (resolve) => (p: { step: StepName; at: Date }) => resolve(p)
);

export const markAllStepsAsSeenAction = createAction(
  'Feedback Dialog: Mark All Steps As Seen',
  (resolve) => (p: { at: Date }) => resolve(p)
);
