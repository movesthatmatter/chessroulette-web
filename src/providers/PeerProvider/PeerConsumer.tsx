import React, { useContext, useEffect, useRef } from 'react';
import { SocketClient } from 'src/services/socket/SocketClient';
import { noop } from 'src/lib/util';
import { PeerContext } from './PeerContext';
import { Peer, Room } from './types';
import { PeerMessageEnvelope } from './records';
import { RoomCredentials } from './types';
import { PeerConnectionsErrors } from './lib/PeerConnections';

// TODO: Make use of the ContextProps with Omit or Pick since 95% of the fields are the same
type RenderJoinedProps = {
  state: 'joined';
  me: Peer;
  room: Room;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
  request: SocketClient['send'];
  leaveRoom: () => void;
};

type RenderNotJoinedProps = {
  state: 'notJoined';
  me: Peer;
  // room: RoomRecord;
  request: SocketClient['send'];
  joinRoom: (c: RoomCredentials) => void;
};

type PeerConsumerProps = {
  renderFallback?: (state: {
    state: 'loading'
  } | {
    state: 'error';
    error: PeerConnectionsErrors;
  }) => React.ReactNode;

  onUpdate?: (p: RenderJoinedProps | RenderNotJoinedProps) => void;
  onReady?: (p: RenderJoinedProps | RenderNotJoinedProps) => void;
  onUnmounted?: (p: RenderJoinedProps | RenderNotJoinedProps | { state: 'init' | 'error' }) => void;

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
  onUnmounted = noop,
  ...props
}) => {
  const contextState = useContext(PeerContext);

  // This is needed to be able to get the latest contextState 
  /// in the unmounting useEffect
  const contextStateRef = useRef(contextState);

  useEffect(() => {
    contextStateRef.current = contextState;
  }, [contextState]);

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
    if (contextState.state === 'init' || contextState.state === 'error') {
      return;
    }

    onUpdate(contextState);
  }, [contextState]);

  useEffect(() => {
    if (contextState.state === 'init' || contextState.state === 'error') {
      return;
    }

    onReady(contextState);
  }, [contextState.state]);

  useEffect(() => {
    return () => {
      onUnmounted(contextStateRef.current);
    }
  }, []);

  if (contextState.state === 'error') {
    return <>{renderFallback(contextState)}</>
  }

  if (contextState.state !== 'init' && 'render' in props) {
    return <>{props.render(contextState)}</>
  }

  if (contextState.state === 'joined' && 'renderRoomJoined' in props) {
    return <>{props.renderRoomJoined(contextState)}</>;
  }

  if (contextState.state === 'notJoined' && 'renderRoomNotJoined' in props && props.renderRoomNotJoined) {
    return <>{props.renderRoomNotJoined(contextState)}</>;
  }

  return <>{renderFallback({ state: 'loading' })}</>;
};
