import { ModuleStateSlice } from './reducer';

export const selectroomBouncerState = (state: ModuleStateSlice) => state.roomBouncer;

export const selectMediaStatus = (state: ModuleStateSlice) =>
  // TODO: Remove the Default once the mediaStatus moves to Session and the Optional goes away
  state.roomBouncer?.mediaStatus || {
    audio: true,
    video: true,
  };
