import React, { useContext, useEffect } from 'react';
import { RoomStatsRecord, SocketPayload } from 'dstnd-io';
import { SocketClient } from 'src/services/socket/SocketClient';
import { PeerContext } from './PeerContext';
import { Room } from '../RoomProvider';
import { PeerMessageEnvelope } from './records';

type RenderJoinedProps = {
  state: 'joined';
  room: Room;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
  request: SocketClient['send'];

  startLocalStream: () => void;
  stopLocalStream: () => void;
};

type RenderNotJoinedProps = {
  state: 'notJoined';
  roomStats: RoomStatsRecord;
  request: SocketClient['send'];
  joinRoom: () => void;
}

type PeerConsumerProps = {
  renderRoomJoined: (p: RenderJoinedProps) => React.ReactNode;
  renderRoomNotJoined?: (p: RenderNotJoinedProps) => React.ReactNode;
  renderFallback?: () => React.ReactNode;
  onReady?: (p: RenderJoinedProps | RenderNotJoinedProps) => void;

  onPeerMsgReceived?: (msg: PeerMessageEnvelope) => void;
  onPeerMsgSent?: (msg: PeerMessageEnvelope) => void;
};

export const PeerConsumer: React.FC<PeerConsumerProps> = ({
  onPeerMsgReceived,
  onPeerMsgSent,
  renderFallback = () => null,
  renderRoomNotJoined = () => null,
  ...props
}) => {
  const contextState = useContext(PeerContext);

  useEffect(() => {
    if (contextState.state === 'joined') {
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
    if (contextState.state !== 'init') {
      props.onReady?.(contextState);
    }
  }, [contextState]);

  if (contextState.state === 'joined') {
    return (
      <>
        {props.renderRoomJoined(contextState)}
      </>
    );
  } if (contextState.state === 'notJoined') {
    return (
      <>
        {renderRoomNotJoined(contextState)}
      </>
    );
  }

  return (
    <>
      {renderFallback()}
    </>
  );
};
