import React, { useContext, useEffect, createRef } from 'react';
import { PeerContext } from './PeerContext';
import { Room } from '../RoomProvider';
import { PeerMessageEnvelope } from './records';

type RenderProps = {
  room: Room;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
};

type PeerConsumerProps = {
  render: (p: RenderProps) => React.ReactNode;
  onReady?: (p: RenderProps) => void;

  onPeerMsgReceived?: (msg: PeerMessageEnvelope) => void;
  onPeerMsgSent?: (msg: PeerMessageEnvelope) => void;
};

export const PeerConsumer: React.FC<PeerConsumerProps> = ({
  onPeerMsgReceived,
  onPeerMsgSent,
  ...props
}) => {
  const contextState = useContext(PeerContext);

  useEffect(() => {
    if (contextState.state === 'connected') {
      const unsubscribers = [
        onPeerMsgReceived && contextState.proxy.onPeerMessageReceived(onPeerMsgReceived),
        onPeerMsgSent && contextState.proxy.onPeerMessageSent(onPeerMsgSent),
      ];

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe?.());
      };
    }

    return () => undefined;
  }, [contextState, onPeerMsgReceived, onPeerMsgSent]);

  useEffect(() => {
    if (contextState.state === 'connected') {
      props.onReady?.(contextState);
    }
  }, [contextState]);

  return (
    <>
      {contextState.state === 'connected' && props.render(contextState)}
    </>
  );
};