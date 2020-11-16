import React, { useState } from 'react';
import { SocketConsumer } from 'src/components/SocketProvider';
import { createUseStyles } from 'src/lib/jss';
import { SocketClient } from '../socket/SocketClient';

type Props = {};

export const UserPeerConnection: React.FC<Props> = (props) => {
  const [socket, setSocket] = useState<SocketClient | undefined>();
  const cls = useStyles();

  return null;

  // return (
  //   <SocketConsumer
  //     onReady={(socketClient) => {
  //       setSocket(socketClient);

  //       socketClient.send({
  //         kind: 'userIdentification',
  //         content: { userId: user.id },
  //       });
  //     }}
  //     onClose={() => {
  //       // TODO: This could be changed at some point - when I'm redoing
  //       //  the strategy for Peer Removal.
  //       dispatch(removeMeAction());

  //       // Once the socket fails destroy the PeerConnection as well
  //       peerConnections.current?.destroy();
  //     }}
  //     render={() => (
  //       <PeerContext.Provider value={contextState}>
  //         {props.children}
  //       </PeerContext.Provider>
  //     )}
  //   />
  // );
};

const useStyles = createUseStyles({
  container: {},
});