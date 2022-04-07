import React from 'react';
import {
  ReadyPeerToServerConnection,
  UnreadyPeerToServerConnection,
  usePeerToServerConnection,
} from './hooks';

type Props = {
  renderReadyConnection: (pcr: ReadyPeerToServerConnection) => React.ReactNode;
  renderFallback?: (pc: UnreadyPeerToServerConnection) => React.ReactNode;
};

export const PeerToServerConsumer: React.FC<Props> = ({
  renderReadyConnection,

  // This hsould return a default messsage
  renderFallback = () => null,
}) => {
  const pc = usePeerToServerConnection();

  if (pc.ready) {
    return <>{renderReadyConnection(pc)}</>;
  }

  return <>{renderFallback(pc)}</>;
};
