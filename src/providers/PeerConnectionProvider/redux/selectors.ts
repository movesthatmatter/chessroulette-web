import { ModuleStateSlice } from './reducer';

export const selectMyPeer = (state: ModuleStateSlice) => state.peer;
