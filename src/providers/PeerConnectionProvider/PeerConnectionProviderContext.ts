import { createContext } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { Peer } from '../PeerProvider';

export type PeerConnectionProviderContextState =
  | {
      ready: false;
      loading: boolean;
    }
  | {
      ready: true;
      peer: Peer;
      connection: SocketClient;
      loading: false;
    };

export const PeerConnectionProviderContext = createContext<PeerConnectionProviderContextState>({
  ready: false,
  loading: false,
});
