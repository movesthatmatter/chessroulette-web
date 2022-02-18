import { createAction } from 'deox';

export const initAudioVideoContraints = createAction(
  'initAudioVideoConstraints',
  (resolve) => (p: { audio: boolean; video: boolean }) => resolve(p)
);

export const updateAVConstraints = createAction(
  'updateAVConstraints',
  (resolve) => (p: {audio: boolean, video: boolean}) => resolve(p)
)
