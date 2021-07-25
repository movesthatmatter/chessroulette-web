import { useEffect, useState } from 'react';
import { Game } from 'src/modules/Games';
import { getPlayerStats, defaultPlayerStats } from 'src/modules/Games/Chess/lib';
import { Room, usePeerState } from 'src/providers/PeerProvider';

const areBothPlayersInRoom = ({ peersIncludingMe }: Room, game: Game) => {
  const [playerA, playerB] = game.players;

  return playerA.user.id in peersIncludingMe && playerB.user.id in peersIncludingMe;
};

const defaultStats = {
  ...defaultPlayerStats,
  canPlay: false as boolean,
} as const;

export const useMyPeerPlayerStats = (game: Game) => {
  const peerState = usePeerState();
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    if (!(peerState.status === 'open' && peerState.hasJoinedRoom)) {
      setStats(defaultStats);
      return;
    }

    const playerStats = getPlayerStats(game, peerState.me.id);

    setStats({
      ...playerStats,
      canPlay: playerStats.canPlay && areBothPlayersInRoom(peerState.room, game),
    });
  }, [game, peerState.status, peerState.status === 'open' && peerState.hasJoinedRoom]);

  return stats;
};
