import { useContext } from 'react';
import { PeerConnectionProviderContext } from '../PeerConnectionProviderContext';
import { ReadyPeerConnection } from './types';

// @deprecate once eerthing moved to the renamed usePeerToServerConnection
export const usePeerConnection = () => useContext(PeerConnectionProviderContext);

// @deprecate once eerthing moved to the renamed useReadyPeerToServerConnection
export const useReadyPeerConnection = (): ReadyPeerConnection | undefined => {
  const pc = usePeerConnection();

  if (!pc.ready) {
    return undefined;
  }

  return pc;
};

export const usePeerToServerConnection = usePeerConnection;

export const useReadyPeerToServerConnection = useReadyPeerConnection;