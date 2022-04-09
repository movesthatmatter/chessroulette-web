import React, { useCallback, useEffect, useState } from 'react';
import { getCurrentlyStreamingRelayedGames } from 'src/modules/Relay/BroadcastPage/resources';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { RelayedGame } from '../types';
import { usePeerConnection } from 'src/providers/PeerConnectionProvider';

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
  const pc = usePeerConnection();

  useEffect(() => {
    if (pc.ready) {
      const unsubscribers = [
        pc.connection.onMessage((payload) => {
          if (payload.kind === 'relayGameUpdateList') {
            fetchLiveGames();
          }
        }),
      ];

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [pc.ready]);

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
