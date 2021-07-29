import { ModuleStateSlice } from './reducer';
import { BaseRoomActivity } from './types';

export const selectCurrentRoomActivity = (s: ModuleStateSlice) => s.roomActivity as BaseRoomActivity;
