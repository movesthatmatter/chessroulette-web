import { ChessGameState, ChessGameColor, ChessPlayer } from 'dstnd-io';

export const getPlayerColor = (
  userId: string,
  players: ChessGameState['players'],
) => {
  const matched = players.find((p) => p.user.id === userId);

  if (matched) {
    return matched.color;
  }

  // Default to white
  return 'white';
};

export const getPlayerByColor = (
  color: ChessGameColor,
  players: ChessGameState['players'],
) => players.find((p) => p.color === color);

export const getPlayer = (
  userId: string,
  players: ChessGameState['players'],
): ChessPlayer | undefined => {
  if (players[0].user.id === userId) {
    return players[0];
  }

  if (players[1]?.user.id === userId) {
    return players[1];
  }

  return undefined;
};

// A Safe way to get the opponent from the given player
// If the given player is not actually part of players then return undefined
//  since now there can be no opposite
export const getOppositePlayer = (
  fromPlayer: ChessPlayer,
  players: ChessGameState['players'],
) => {
  if (!isPlayer(fromPlayer.user.id, players)) {
    return undefined;
  }

  return (players[0].user.id === fromPlayer.user.id)
    ? players[1]
    : players[0];
}

export const isPlayer = (
  userId: string,
  players: ChessGameState['players'],
) => !!players.find((p) => p.user.id === userId);
