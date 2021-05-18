import { ModuleStateSlice } from './reducer';

export const selectPeerProviderState = (state: ModuleStateSlice) => state.peerProvider;

export const selectMyPeer = (state: ModuleStateSlice) => state.peerProvider.me;

export const selectChatHistory = (state: ModuleStateSlice) => state.peerProvider.room?.chatHistory;

export const selectUserID = (state: ModuleStateSlice) => state.peerProvider.me?.id;

export const selectRoomActivity = (state: ModuleStateSlice) => state.peerProvider.room?.activity;

export const selectRoom = (state: ModuleStateSlice) => state.peerProvider.room;
