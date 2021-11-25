import React, { useEffect, useState } from 'react';
import { getCurrentlyStreamingRelayedGames } from 'src/modules/Relay/BroadcastPage/resources';
import { Game } from 'src/modules/Games';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { usePeerState } from 'src/providers/PeerProvider';

type GameAndRelayId = {game: Game, relayId: string, label?: string}

type Props = {
  pageSize: number;
  rowClassName? :string;
  render: (p: {
    games: GameAndRelayId[];
    isLoading: boolean;
    label? :string;
    isEmpty: boolean;
    isReady: boolean;
  }) => React.ReactNode;
};

export const RelayedGameProvider: React.FC<Props> = (props) => {

  const [games, setItems] = useState<GameAndRelayId[]>([]);
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
  },[])

  function fetchLiveGames() {
    getCurrentlyStreamingRelayedGames()
    .map(relayedGames => {
      setItems(relayedGames.map(g => ({
        game: gameRecordToGame(g.game), 
        relayId: g.id,
        ...(g.label && {label: g.label})
      })))
      setIsLoading(false);
    })
  }

  return (
      <>
      {props.render({
        games,
        isLoading,
        isEmpty : games.length === 0,
        isReady : isLoading === false
      })}
      </>
  );
};