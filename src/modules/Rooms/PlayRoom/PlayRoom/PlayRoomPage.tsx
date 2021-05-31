import React, { useCallback, useEffect, useState } from 'react';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { Events } from 'src/services/Analytics';
import { usePeerState } from 'src/providers/PeerProvider';
import { PlayRoom } from 'src/modules/Rooms/PlayRoom/PlayRoom/PlayRoom';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Game } from 'src/modules/Games';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { useGameActions } from 'src/modules/Games/GameActions';


type Props = {
  room: RoomWithPlayActivity;
};

export const PlayRoomPage: React.FC<Props> = ({ room }) => {
  const peerState = usePeerState();
  const [connectionAttempt, setConnectionAttempt] = useState(false);

  // TODO: Move all the game actions/updates/state in modules/ChessGame
  const gameActions = useGameActions();

  // TODO: This could be in redux but it's ok for now!
  const [game, setGame] = useState<Game>();

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
      // request(gameActions.join());
      gameActions.onJoin();

      const unsubscribers = [
        peerState.client.onMessage((payload) => {
          if (payload.kind === 'joinedGameUpdated') {
            setGame(gameRecordToGame(payload.content));
          } else if (payload.kind === 'joinedRoomAndGameUpdated'){
            setGame(gameRecordToGame(payload.content.game));
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
    />
  );
};
