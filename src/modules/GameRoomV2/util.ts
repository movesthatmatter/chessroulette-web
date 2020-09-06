import { ChessGameState, ChessGameColor } from 'dstnd-io';

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

export const getOpponent = (
  userId: string,
  players: ChessGameState['players'],
) => {
  const matched = players.find((p) => p.user.id !== userId);

  if (matched) {
    return matched;
  }

  return undefined;
};

export const isPlayer = (
  userId: string,
  players: ChessGameState['players'],
) => !!players.find((p) => p.user.id === userId);
