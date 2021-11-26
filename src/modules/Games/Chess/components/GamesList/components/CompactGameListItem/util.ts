import { ChessGameColor, GameRecord, GameRecordFinished, GameRecordStopped } from 'dstnd-io';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import HumanizeDuration from 'humanize-duration';
import { getPlayer, getPlayerByColor } from 'src/modules/Games/Chess/lib';

export const formatTimeLimit = HumanizeDuration.humanizer({
  largest: 2,
  round: true,
});

export const winningEmoji = '🏆';
export const losingEmoji = '🥶';
export const drawEmoji = '';

export const getResult = (game: GameRecordFinished | GameRecordStopped) => {
  if (game.winner === '1/2') {
    return 'Game Ended in a Draw!';
  }

  if (game.state === 'stopped') {
    return 'Game Was Stopped!';
  }

  return 'Game Ended in Check Mate!';
};

export const getMyResult = (game: GameRecordFinished | GameRecordStopped, myId: string) => {
  const meAsPlayer = getPlayer(myId, game.players);

  if (!meAsPlayer) {
    return undefined;
  }

  if (game.winner === '1/2') {
    return 'draw' as const;
  }

  return game.winner === meAsPlayer.color ? ('won' as const) : ('lost' as const);
};

export const getScore = (game: GameRecordFinished | GameRecordStopped) => {
  if (game.winner === '1/2') {
    return '1/2' as const;
  }

  if (game.winner === game.players[0].color) {
    return '1-0' as const;
  }

  return '0-1' as const;
};

export const hasWonByColor = (game: GameRecordFinished | GameRecordStopped, color: ChessGameColor) => {
  return game.winner === getPlayerByColor(color, game.players).color;
};
