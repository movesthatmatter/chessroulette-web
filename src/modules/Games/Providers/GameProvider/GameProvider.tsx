import React, { useEffect, useState, useCallback } from 'react';
import { noop } from 'src/lib/util';
import { usePeerState } from 'src/providers/PeerProvider';
import { SocketClient } from 'src/services/socket/SocketClient';
import { gameRecordToGame } from '../../Chess/lib';
import { Game } from '../../types';
import { getGameActions } from './GameActionsProxy';
import { GameProviderContext } from './GameProviderContext';

type Props = {
  // This could take a Game Id and only subscribe to this game
  //  in the future!
  onGameUpdated?: (nextGame: Game) => void;
};

export const GameProvider: React.FC<Props> = ({ onGameUpdated = noop, children }) => {
  const peerState = usePeerState();

  const request = useCallback<SocketClient['send']>(
    (payload) => {
      // TODO: Look into what to do if not open!
      // THE ui should actually change and not allow interactions, but ideally
      //  the room still shows!
      // TODO: That should actually be somewhere global maybe!
      if (peerState.status === 'open') {
        peerState.client.send(payload);
      }
    },
    [peerState.status]
  );

  const [contextState, setContextState] = useState({
    gameActions: getGameActions(request),
  });

  useEffect(() => {
    setContextState({
      gameActions: getGameActions(request),
    });
  }, [request]);

  // Subscribe to Game Updates
  useEffect(() => {
    const unsubscribers: Function[] = [];

    if (peerState.status === 'open') {
      const usubscribe = peerState.client.onMessage((payload) => {
        if (payload.kind === 'joinedGameUpdated') {
          onGameUpdated(gameRecordToGame(payload.content));
        } else if (payload.kind === 'joinedRoomAndGameUpdated') {
          onGameUpdated(gameRecordToGame(payload.content.game));
        }
      });

      unsubscribers.push(usubscribe);
    }

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [peerState.status]);

  // Join the Game
  useEffect(() => {
    contextState.gameActions.onJoin();
  }, [contextState]);

  return (
    <GameProviderContext.Provider value={contextState}>{children}</GameProviderContext.Provider>
  );
};
