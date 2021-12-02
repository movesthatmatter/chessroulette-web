import React, { useEffect, useState } from 'react';
import { getCurrentlyStreamingRelayedGames } from 'src/modules/Relay/BroadcastPage/resources';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { usePeerState } from 'src/providers/PeerProvider';
import { RelayedGame } from '../types';
import { useCallback } from '@storybook/addons';

type Props = {
  pageSize: number;
  rowClassName?: string;
  render: (p: {
    relayedGames: RelayedGame[];
    isLoading: boolean;
    label?: string;
    isEmpty: boolean;
    isReady: boolean;
  }) => React.ReactNode;
};

export const RelayedGameProvider: React.FC<Props> = (props) => {
  const [relayedGames, setRelayedGames] = useState<RelayedGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const peerState = usePeerState();

  useEffect(() => {
    if (peerState.status === 'open') {
      const unsubscribers = [
        peerState.client.onMessage((payload) => {
          if (payload.kind === 'relayGameUpdateList') {
            fetchLiveGames();
          }
        }),
      ];

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [peerState.status]);

  useEffect(() => {
    fetchLiveGames();
  }, []);

  const fetchLiveGames = useCallback(() => {
    getCurrentlyStreamingRelayedGames().map((relayedGames) => {
      setRelayedGames(
        relayedGames.map((relayedGame) => ({
          ...relayedGame,
          game: gameRecordToGame(relayedGame.game),
        }))
      );
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {props.render({
        relayedGames,
        isLoading,
        isEmpty: relayedGames.length === 0,
        isReady: isLoading === false,
      })}
    </>
  );
};
