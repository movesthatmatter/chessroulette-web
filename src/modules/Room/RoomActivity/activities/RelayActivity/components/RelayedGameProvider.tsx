import React, { useEffect, useState } from 'react';
import { getCurrentlyStreamingRelayedGames } from 'src/modules/Relay/BroadcastPage/resources';
import { Game } from 'src/modules/Games';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';

type GameAndRelayId = {game: Game, relayId: string}

type Props = {
  pageSize: number;
  rowClassName? :string;
  render: (p: {
    games: GameAndRelayId[];
    isLoading: boolean;
    isEmpty: boolean;
    isReady: boolean;
  }) => React.ReactNode;
};

export const RelayedGameProvider: React.FC<Props> = (props) => {

  const [games, setItems] = useState<GameAndRelayId[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentlyStreamingRelayedGames()
    .map(relayedGames => {
      setItems(relayedGames.map(g => ({game: gameRecordToGame(g.game), relayId: g.id})))
      setIsLoading(false);
    })
  },[])

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