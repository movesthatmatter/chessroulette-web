import { IceServerRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resources } from 'src/resources';
import { useAuthentication } from 'src/services/Authentication';
import { SocketConnectionIdentificationHandler } from './Handlers';
import { PeerProvider } from './PeerProvider';
import { selectPeerProviderState } from './redux/selectors';

type Props = {};

export const PeerProviderContainer: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const auth = useAuthentication();
  const [iceServers, setIceServers] = useState<IceServerRecord[]>();
  const peerProviderState = useSelector(selectPeerProviderState);

  // Get ICE Urls onmount
  useEffect(() => {
    (async () => {
      (await resources.getIceURLS()).map(setIceServers);
    })();
  }, []);

  if (auth.authenticationType === 'none') {
    // TODO: Handle this uss case as well
    return null;
  }

  if (!iceServers) {
    // TODO: this might not need to be so!
    return null;
  }

  return (
    <SocketConnectionIdentificationHandler
      {...(auth.authenticationType === 'guest'
        ? {
            isGuest: true,
            guestUser: auth.user,
          }
        : {
            isGuest: false,
            accessToken: auth.accessToken,
          })}
      render={({ socket }) => (
        <PeerProvider
          iceServers={iceServers}
          user={auth.user}
          dispatch={dispatch}
          socketClient={socket}
          roomAndMe={peerProviderState}
        >
          {props.children}
        </PeerProvider>
      )}
    />
  );
};
