import React, { useEffect, useState, useCallback } from 'react';
import { noop } from 'src/lib/util';
import { usePeerConnection } from 'src/providers/PeerConnectionProvider';
import { SocketClient } from 'src/services/socket/SocketClient';
import { WarGame } from '../../types';
import { getWarGameActions } from './WarGameActionsProxy';
import { WarGameProviderContext } from './WarGameProviderContext';

type Props = {
  // This could take a Game Id and only subscribe to this game
  //  in the future!
  onGameUpdated?: (nextGame: WarGame) => void;
};

export const WarGameProvider: React.FC<Props> = ({ onGameUpdated = noop, children }) => {
  const pc = usePeerConnection();

  const request = useCallback<SocketClient['send']>(
    (payload) => {
      // TODO: Look into what to do if not open!
      // THE ui should actually change and not allow interactions, but ideally
      //  the room still shows!
      // TODO: That should actually be somewhere global maybe!
      if (pc.ready) {
        pc.connection.send(payload);
      }
    },
    [pc.ready]
  );

  const [contextState, setContextState] = useState({
    warGameActions: getWarGameActions(request),
  });

  useEffect(() => {
    setContextState({
      warGameActions: getWarGameActions(request),
    });
  }, [request]);

  // Subscribe to Game Updates
  useEffect(() => {
    const unsubscribers: Function[] = [];
    if (pc.ready) {
      const usubscribe = pc.connection.onMessage((payload) => {
        if (payload.kind === 'joinedWarGameUpdated') {
          onGameUpdated(payload.content);
        } else if (payload.kind === 'joinedRoomAndWarGameUpdated') {
          onGameUpdated(payload.content.game);
        }
      });

      unsubscribers.push(usubscribe);
    }

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [pc.ready]);

  // Join the Game
  useEffect(() => {
    contextState.warGameActions.onJoin();
  }, [contextState]);

  return (
    <WarGameProviderContext.Provider value={contextState}>{children}</WarGameProviderContext.Provider>
  );
};
