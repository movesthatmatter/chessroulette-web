import { useContext } from 'react';
import { PeerConnectionProviderContext } from '../PeerConnectionProviderContext';

export const usePeerConnection = () => useContext(PeerConnectionProviderContext);

export const useRedyPeerConnection = () => {
  const pc = usePeerConnection();

  if (!pc.ready) {
    return undefined;
  }

  return pc;
};
