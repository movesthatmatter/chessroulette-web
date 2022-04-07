import React, { useEffect, useState } from 'react';
import { useAuthentication } from 'src/services/Authentication';
import { SocketConnectionIdentificationHandler } from './SocketConnectionIdentificationHandler';
import {
  PeerConnectionProviderContext,
  PeerConnectionProviderContextState,
} from './PeerConnectionProviderContext';
import { SocketProvider } from 'src/providers/SocketProvider';
import { SocketConnectionStatusNonOpen } from '../SocketProvider/types';
import { noop } from 'src/lib/util';
import { useDispatch } from 'react-redux';
import { SocketClient } from 'src/services/socket/SocketClient';
import { createPeerConnectionAction, updatePeerConnectionAction } from './redux/actions';
import { useMyPeer } from './hooks';

type Props = {
  renderFallback?: (p: SocketConnectionStatusNonOpen) => React.ReactNode;
};

export const PeerToServerProvider: React.FC<Props> = ({ renderFallback = noop, children }) => {
  const auth = useAuthentication();
  const myPeer = useMyPeer();
  const dispatch = useDispatch();
  const [peerContextState, setPeerContext] = useState<PeerConnectionProviderContextState>({
    ready: false,
    loading: false,
  });
  const [socket, setSocket] = useState<SocketClient>();

  // Keep the Context in sync with the Redux State
  useEffect(() => {
    if (myPeer && socket) {
      setPeerContext({
        ready: true,
        loading: false,
        peer: myPeer,
        connection: socket,
      });
    } else {
      setPeerContext({ ready: false, loading: !!socket });
    }
  }, [myPeer, socket]);

  return (
    <SocketProvider>
      <PeerConnectionProviderContext.Provider value={peerContextState}>
        {auth.authenticationType !== 'none' && (
          <SocketConnectionIdentificationHandler
            {...(auth.authenticationType === 'guest'
              ? {
                  isGuest: true,
                  guestUser: auth.user,
                }
              : {
                  isGuest: false,
                  authenticationToken: auth.authenticationToken,
                })}
            onReady={({ socket }) => {
              setSocket(socket);
            }}
            onClose={() => {
              setSocket(undefined);
            }}
            onPeerUpdate={({ peer: nextPeer }) => {
              dispatch(
                myPeer ? updatePeerConnectionAction(nextPeer) : createPeerConnectionAction(nextPeer)
              );
            }}
            render={(p) => {
              if (p.status === 'open') {
                return <>{children}</>;
              }

              return <>{renderFallback(p.status)}</>;
            }}
          />
        )}
      </PeerConnectionProviderContext.Provider>
    </SocketProvider>
  );
};
