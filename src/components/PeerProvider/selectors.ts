import { ModuleStateSlice } from './reducer';

export const selectPeerProviderState = (state: ModuleStateSlice) => state.peerProvider;
