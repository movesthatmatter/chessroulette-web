import { useContext } from 'react';
import {
  PeerConnectionProviderContext,
  ReadyPeerConnectionProviderContextState,
  UnreadyPeerConnectionProviderContextState,
} from '../PeerConnectionProviderContext';

export const usePeerConnection = () => useContext(PeerConnectionProviderContext);

export type ReadyPeerConnection = ReadyPeerConnectionProviderContextState;
export type UnreadyPeerConnection = UnreadyPeerConnectionProviderContextState;

export const useReadyPeerConnection = (): ReadyPeerConnection | undefined => {
  const pc = usePeerConnection();

  if (!pc.ready) {
    return undefined;
  }

  return pc;
};
