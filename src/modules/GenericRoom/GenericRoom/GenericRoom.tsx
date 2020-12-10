import React, { useCallback, useEffect, useState } from 'react';
import { gameActions } from 'src/modules/Games/Chess/gameActions';
import { GameRoomV2 } from 'src/modules/GameRoomV2/GameRoomV2';
import { Room, RoomWithPlayActivity } from 'src/components/RoomProvider';
import { Events } from 'src/services/Analytics';
import { SocketClient } from 'src/services/socket/SocketClient';
import { usePeerState } from 'src/components/PeerProvider';

type Props = {
  room: Room;
};

export const GenericRoom: React.FC<Props> = ({
  room,
}) => {
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
  }

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

  // This only support Play Rooms for now! 
  if (room.activity.type !== 'play') {
    return null;
  }

  return (
    <>
    <GameRoomV2
      key={room.id}
      room={room as RoomWithPlayActivity}
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
      onStatusCheck={() => request(gameActions.statusCheck())}
    />
    </>
  );
};
