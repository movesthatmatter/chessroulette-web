import capitalize from 'capitalize';
import { ChessGameState, UserRecord } from 'dstnd-io';
import { getPlayer } from '../GameRoomV2/util';

export const getGameResult = (game: ChessGameState, userId: UserRecord['id']) => {
  if (game.winner === '1/2') {
    return 'Draw';
  }

  const winningColor = game.winner;

  const userPlayer = getPlayer(userId, game.players);

  if (!userPlayer) {
    return `${capitalize(winningColor || '')} Won`;
  }

  if (userPlayer.color === game.winner) {
    return 'Won';
  }

  return 'Lost';
};
