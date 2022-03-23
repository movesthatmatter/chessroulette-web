import { useContext } from 'react';
import { PeerConnectionProviderContext } from '../PeerConnectionProviderContext';
import { ReadyPeerConnection } from './types';

export const usePeerConnection = () => useContext(PeerConnectionProviderContext);

export const useReadyPeerConnection = (): ReadyPeerConnection | undefined => {
  const pc = usePeerConnection();

  if (!pc.ready) {
    return undefined;
  }

  return pc;
};
