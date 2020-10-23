import React, { useContext, useEffect } from 'react';
import { RoomRecord, RoomStatsRecord } from 'dstnd-io';
import { SocketClient } from 'src/services/socket/SocketClient';
import { noop } from 'src/lib/util';
import { PeerContext } from './PeerContext';
import { Peer, Room } from '../RoomProvider';
import { PeerMessageEnvelope } from './records';
import { RoomCredentials } from './util';

type RenderJoinedProps = {
  state: 'joined';
  me: Peer;
  room: Room;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
  request: SocketClient['send'];

  startLocalStream: () => void;
  stopLocalStream: () => void;
};

type RenderNotJoinedProps = {
  state: 'notJoined';
  me: Peer;
  // room: RoomRecord;
  request: SocketClient['send'];
  joinRoom: (c: RoomCredentials) => void;
};

type PeerConsumerProps = {
  renderFallback?: () => React.ReactNode;

  onUpdate?: (p: RenderJoinedProps | RenderNotJoinedProps) => void;
  onReady?: (p: RenderJoinedProps | RenderNotJoinedProps) => void;

  onPeerMsgReceived?: (msg: PeerMessageEnvelope) => void;
  onPeerMsgSent?: (msg: PeerMessageEnvelope) => void;
} & ({
  render: (p: RenderNotJoinedProps | RenderJoinedProps) => React.ReactNode;
} | {
  // TODO: Look into this being needed anymore, now that we have a generic render
  renderRoomJoined: (p: RenderJoinedProps) => React.ReactNode;
  renderRoomNotJoined?: (p: RenderNotJoinedProps) => React.ReactNode;
});

export const PeerConsumer: React.FC<PeerConsumerProps> = ({
  onPeerMsgReceived,
  onPeerMsgSent,
  renderFallback = () => null,
  onUpdate = noop,
  onReady = noop,
  ...props
}) => {
  const contextState = useContext(PeerContext);

  useEffect(() => {
    if (contextState.state === 'joined') {
      const unsubscribers = [
        onPeerMsgReceived
          && contextState.proxy.onPeerMessageReceived(onPeerMsgReceived),
        onPeerMsgSent && contextState.proxy.onPeerMessageSent(onPeerMsgSent),
      ];

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe?.());
      };
    }

    return () => undefined;
  }, [contextState, onPeerMsgReceived, onPeerMsgSent]);

  useEffect(() => {
    if (contextState.state === 'init') {
      return;
    }

    onUpdate(contextState);
  }, [contextState]);

  useEffect(() => {
    if (contextState.state === 'init') {
      return;
    }

    onReady(contextState);
  }, [contextState.state]);

  if (contextState.state !== 'init' && 'render' in props) {
    return <>{props.render(contextState)}</>
  }

  if (contextState.state === 'joined' && 'renderRoomJoined' in props) {
    return <>{props.renderRoomJoined(contextState)}</>;
  }

  if (contextState.state === 'notJoined' && 'renderRoomNotJoined' in props && props.renderRoomNotJoined) {
    return <>{props.renderRoomNotJoined(contextState)}</>;
  }

  return <>{renderFallback()}</>;
};
