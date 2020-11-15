import { ModuleStateSlice } from './reducer';

export const selectPeerProviderState = (state: ModuleStateSlice) => state.peerProvider;

export const selectMyPeer = (state: ModuleStateSlice) => state.peerProvider.me;