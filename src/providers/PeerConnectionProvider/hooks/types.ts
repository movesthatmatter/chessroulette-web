import {
  ReadyPeerConnectionProviderContextState,
  UnreadyPeerConnectionProviderContextState,
} from '../PeerConnectionProviderContext';

// @remove in favorReadyPeerToServerConnection
export type ReadyPeerConnection = ReadyPeerConnectionProviderContextState;
export type UnreadyPeerConnection = UnreadyPeerConnectionProviderContextState;

export type ReadyPeerToServerConnection = ReadyPeerConnection;
export type UnreadyPeerToServerConnection = UnreadyPeerConnectionProviderContextState;
