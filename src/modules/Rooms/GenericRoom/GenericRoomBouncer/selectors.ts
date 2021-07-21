import { ModuleStateSlice } from './reducer';

export const selectroomBouncerState = (state: ModuleStateSlice) => state.roomBouncer;

export const selectMediaStatus = (state : ModuleStateSlice) => state.roomBouncer?.mediaStatus;