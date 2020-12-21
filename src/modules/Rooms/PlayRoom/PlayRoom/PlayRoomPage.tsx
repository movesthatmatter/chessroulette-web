import React, { useCallback, useEffect, useState } from 'react';
import { gameActions } from 'src/modules/Games/Chess/gameActions';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { Events } from 'src/services/Analytics';
import { SocketClient } from 'src/services/socket/SocketClient';
import { usePeerState } from 'src/providers/PeerProvider';
import { PlayRoom } from 'src/modules/Rooms/PlayRoom/PlayRoom/PlayRoom';

type Props = {
  room: RoomWithPlayActivity;
};

export const PlayRoomPage: React.FC<Props> = ({ room }) => {
  const peerState = usePeerState();
  const [connectionAttempt, setConnectionAttempt] = useState(false);

  const request: SocketClient['send'] = (payload) => {
    // TODO: Look into what to do if not open!
    // THE ui should actually change and not allow interactions, but ideally
    //  the room still shows!
    // TODO: That should actually be somewhere global maybe!
    if (peerState.status === 'open') {
      peerState.client.send(payload);
    }
  };

  const connectToRoom = useCallback(() => {
    if (peerState.status === 'open' && peerState.hasJoinedRoom && !connectionAttempt) {
      peerState.connectToRoom();
      setConnectionAttempt(true);
    }
  }, [peerState, connectionAttempt]);

  const leaveRoom = useCallback(() => {
    if (peerState.status === 'open' && peerState.hasJoinedRoom) {
      peerState.leaveRoom();
    }
  }, [peerState]);

  // Connect to the Room on Mount
  useEffect(connectToRoom, [connectToRoom]);

  // Leave the Room on unmount
  useEffect(() => leaveRoom, []);

  // Analytics
  useEffect(() => {
    Events.trackPageView('Play Room');
  }, []);

  return (
    <PlayRoom
      key={room.id}
      room={room}
      onMove={(nextMove, _, history, color) => {
        request(gameActions.move(nextMove));

        // Track Game Started for both Colors
        if (
          (color === 'white' && history.length === 1) ||
          (color === 'black' && history.length === 2)
        ) {
          Events.trackGameStarted(color);
        }
      }}
      onOfferDraw={() => {
        request(gameActions.offerDraw());

        Events.trackDrawOffered();
      }}
      onDrawAccepted={() => {
        request(gameActions.acceptDraw());

        Events.trackDrawAccepted();
      }}
      onDrawDenied={() => {
        request(gameActions.denyDraw());

        Events.trackDrawDenied();
      }}
      onResign={() => {
        request(gameActions.resign());

        Events.trackResigned();
      }}
      onAbort={() => {
        request(gameActions.abort());

        Events.trackAborted();
      }}
      onRematchOffer={() => {
        request(gameActions.offerRematch());

        Events.trackRematchOffered();
      }}
      onRematchAccepted={() => {
        request(gameActions.acceptRematch());

        Events.trackRematchAccepted();
      }}
      onRematchDenied={() => {
        request(gameActions.denyRematch());

        Events.trackRematchDenied();
      }}
      onOfferCanceled={() => request(gameActions.cancelOffer())}
      onTimerFinished={() => request(gameActions.statusCheck())}
      onGameStatusCheck={() => request(gameActions.statusCheck())}
    />
  );
};
