import { createContext } from 'react';
import { PeersMap } from 'src/providers/PeerProvider';
import { PeerConnections } from './PeerConnections';

export type PeerConnectionsContextState =
  | {
      ready: false;
    }
  | {
      ready: true;
      client: PeerConnections;
      connectToPeers: (peers: PeersMap) => void;
      disconnectFromAllPeers: () => void;
      connectionAttempted: boolean;
    };

export const PeerConnectionsContext = createContext<PeerConnectionsContextState>({
  ready: false,
});
