import React, {
  useContext,
  useEffect,
} from 'react';
import { noop } from 'src/lib/util';
import { PeerContext } from './PeerContext';
import { Room } from '../RoomProvider';
import { PeerMessageEnvelope } from './records';

type RenderProps = {
  room: Room;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
};

type PeerConsumerProps = {
  render: (p: RenderProps) => React.ReactNode;

  onPeerMsgReceived?: (
    msg: PeerMessageEnvelope,

  // TODO: Is this really needed?
  // p: Pick<RenderProps, 'broadcastMessage'>
  ) => void;
  onPeerMsgSent?: (
    msg: PeerMessageEnvelope,

  // TODO: Is this really needed?
  // p: Pick<RenderProps, 'broadcastMessage'>
  ) => void;
};

export const PeerConsumer: React.FC<PeerConsumerProps> = ({
  onPeerMsgReceived = noop,
  onPeerMsgSent = noop,
  ...props
}) => {
  const contextState = useContext(PeerContext);

  useEffect(() => {
    if (contextState.proxy) {
      const unsubscribers = [
        contextState.proxy.onPeerMessageReceived(onPeerMsgReceived),
        contextState.proxy.onPeerMessageSent(onPeerMsgSent),
      ];

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      };
    }

    return () => undefined;
  }, [contextState]);

  return (
    <>
      {contextState.room && props.render({
        room: contextState.room,
        broadcastMessage: contextState.broadcastMessage,
      })}
    </>
  );
};
