import { ModuleStateSlice } from './reducer';
import { RoomActivity } from './types';

export const selectCurrentRoomActivity = (s: ModuleStateSlice) => s.roomActivity as RoomActivity;
