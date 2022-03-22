import { ModuleStateSlice } from './reducer';

export const selectRoom = (state: ModuleStateSlice) => state.room.roomInfo || undefined; // TODO: rename the key