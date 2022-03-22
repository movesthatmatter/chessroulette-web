import { IceServerRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from 'src/components/Dialog';
import { Page } from 'src/components/Page';
import { resources } from 'src/resources';
import { useAuthentication } from 'src/services/Authentication';
import { SocketConnectionIdentificationHandler } from './PeerProvider/Handlers';
import { PeerContext } from './PeerProvider/PeerContext';
import { PeerProvider } from './PeerProvider/PeerProvider';
import { selectPeerProviderState } from './PeerProvider/redux/selectors';
import { SocketProvider } from './SocketProvider';

type Props = {};

/*** 
 * Mon 7th of March 2022
 * This is the Liason between the Socket and PeerProvider (based on PeerJS)
 * TOOD: Might need to name it differently and refactor a little. For ex,
 *  The PeerProvider could only deal with PeerJS (i.e. RTC connections)
 * while the RoomProvider with the room and so on, but maybe not!
 * Maybe it's ok that the PeerProvider deals with more than just the PeerJS,
 *  but with the whole Peer which is a connected User. Might need to come up
 * with different terminology in order to be more concise and accurate
 * but for now I believe it's fine 
 * 
 * @param props 
 */
export const PeerConnectionProvider: React.FC<Props> = (props) => {
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

  const [initPeerContextState] = useState({ ready: false, status: 'init' } as const);

  if (!(iceServers && auth.authenticationType !== 'none')) {
    return (
      <PeerContext.Provider value={initPeerContextState}>{props.children}</PeerContext.Provider>
    );
  }

  return (
    <SocketProvider>
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

          return (
            <PeerContext.Provider value={initPeerContextState}>
              {props.children}
            </PeerContext.Provider>
          );
        }}
      />
    </SocketProvider>
  );
};
