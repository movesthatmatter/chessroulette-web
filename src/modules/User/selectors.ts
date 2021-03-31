import { ModuleStateSlice } from './reducer';

export const selectAnyUser = (state: ModuleStateSlice) => state.user;

export const selectUser = (state: ModuleStateSlice) => (state.user && !state.user.isGuest) ? state.user : undefined;

export const selectGuestUser = (state: ModuleStateSlice) => (state.user && state.user.isGuest) ? state.user : undefined;
