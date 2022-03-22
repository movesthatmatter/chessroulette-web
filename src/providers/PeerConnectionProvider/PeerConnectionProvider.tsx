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
import { useDispatch, useSelector } from 'react-redux';
import { selectMyPeer } from './redux/selectors';
import { SocketClient } from 'src/services/socket/SocketClient';
import { createPeerConnectionAction, updatePeerConnectionAction } from './redux/actions';

type Props = {
  renderFallback?: (p: SocketConnectionStatusNonOpen) => React.ReactNode;
};

export const PeerConnectionProvider: React.FC<Props> = ({ renderFallback = noop, children }) => {
  const auth = useAuthentication();
  const peer = useSelector(selectMyPeer);
  const dispatch = useDispatch();
  const [peerContextState, setPeerContext] = useState<PeerConnectionProviderContextState>({
    ready: false,
    loading: false,
  });
  const [socket, setSocket] = useState<SocketClient>();

  // Keep the Context in sync with the Redux State
  useEffect(() => {
    if (peer && socket) {
      setPeerContext({
        ready: true,
        loading: false,
        peer,
        connection: socket,
      });
    } else {
      setPeerContext({ ready: false, loading: !!socket });
    }
  }, [peer, socket]);

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
              console.log('next peer', nextPeer);
              dispatch(
                peer ? updatePeerConnectionAction(nextPeer) : createPeerConnectionAction(nextPeer)
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
