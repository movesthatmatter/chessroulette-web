import { IceServerRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from 'src/components/Dialog';
import { Page } from 'src/components/Page';
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
      render={(p) => {
        if (p.status === 'disconnected') {
          return (
            <Page doNotTrack>
              <Dialog
                visible
                title="You got disconnected!"
                content="This could happen if you have another session opened or no internet!"
                hasCloseButton={false}
                buttonsStacked
                buttons={[
                  {
                    label: 'Oh no! Reconnect Me',
                    onClick: () => {
                      window.location.reload();
                    },
                    type: 'primary',
                    full: true,
                  },
                ]}
              />
            </Page>
          );
        }

        if (p.status === 'open') {
          return (
            <PeerProvider
              iceServers={iceServers}
              user={auth.user}
              dispatch={dispatch}
              socketClient={p.socket}
              roomAndMe={peerProviderState}
            >
              {props.children}
            </PeerProvider>
          );
        }

        return null;
      }}
    />
  );
};
