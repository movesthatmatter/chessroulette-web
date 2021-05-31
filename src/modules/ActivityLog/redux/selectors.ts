import { ModuleStateSlice } from './reducer';

export const selectCurrentRoomActivityLog = (s: ModuleStateSlice) => s.activityLog.currentRoom;
