import { createContext } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { Peer } from './types';

export type ReadyPeerConnectionProviderContextState = {
  ready: true;
  peer: Peer;
  connection: SocketClient;
  loading: false;
};

export type UnreadyPeerConnectionProviderContextState = {
  ready: false;
  loading: boolean;
};

export type PeerConnectionProviderContextState =
  | UnreadyPeerConnectionProviderContextState
  | ReadyPeerConnectionProviderContextState;

export const PeerConnectionProviderContext = createContext<PeerConnectionProviderContextState>({
  ready: false,
  loading: false,
});
