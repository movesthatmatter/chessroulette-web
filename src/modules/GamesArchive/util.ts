import capitalize from 'capitalize';
import { UserRecord } from 'dstnd-io';
import { getPlayer } from '../GameRoomV2/util';
import { Game } from '../Games/types';

export const getGameResult = (game: Game, userId: UserRecord['id']) => {
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
