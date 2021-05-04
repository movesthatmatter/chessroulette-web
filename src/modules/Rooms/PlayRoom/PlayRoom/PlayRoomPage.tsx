import React, { useCallback, useEffect, useState } from 'react';
import { gameActions } from 'src/modules/Games/Chess/gameActions';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { Events } from 'src/services/Analytics';
import { SocketClient } from 'src/services/socket/SocketClient';
import { usePeerState } from 'src/providers/PeerProvider';
import { PlayRoom } from 'src/modules/Rooms/PlayRoom/PlayRoom/PlayRoom';
import { chessGameUtils } from 'dstnd-io';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Game } from 'src/modules/Games';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';


type Props = {
  room: RoomWithPlayActivity;
};

export const PlayRoomPage: React.FC<Props> = ({ room }) => {
  const peerState = usePeerState();
  const [connectionAttempt, setConnectionAttempt] = useState(false);

  // TODO: This could be in redux but it's ok for now!
  const [game, setGame] = useState<Game>();

  const request: SocketClient['send'] = (payload) => {
    // TODO: Look into what to do if not open!
    // THE ui should actually change and not allow interactions, but ideally
    //  the room still shows!
    // TODO: That should actually be somewhere global maybe!
    if (peerState.status === 'open') {
      peerState.client.sendMessage(payload);
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

  // Subscribe to Game Updates
  useEffect(() => {
    if (peerState.status === 'open') {
      // Automatically Join the game for now!
      // In the future this might be differed to the User or other actions
      //  depending on the requirements
      // TODO: Also, the game could not be considered ready to start until
      //  it's joined by both players or something alike!
      // This could also help with the idea of creating new games from inside the room
      //  between different peers than the ones that created & accepted the challenge
      request(gameActions.join());

      const unsubscribers = [
        peerState.client.onMessage((payload) => {
          if (payload.kind === 'joinedGameUpdated') {
            setGame(gameRecordToGame(payload.content));
          }
        }),
      ];

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      }
    }
  }, [peerState.status]);

  // Analytics
  useEffect(() => {
    Events.trackPageView('Play Room');
  }, []);

  if (!game) {
    return <AwesomeLoaderPage />;
  }

  return (
    <PlayRoom
      key={room.id}
      room={room}
      game={game}
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
