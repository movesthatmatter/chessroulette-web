import { WarGameRecord } from 'dstnd-io';
import { WarGameParticipants } from '../types';

export const getPlayersTimeLeft = (game: WarGameRecord, participants: WarGameParticipants) => {
  const now = new Date().getTime();

  const home =
    game.state === 'started' && game.lastMoveBy !== participants.home.color
      ? game.timeLeft[participants.home.color] - (now - new Date(game.lastMoveAt).getTime())
      : game.timeLeft[participants.home.color];

  const away =
    game.state === 'started' && game.lastMoveBy !== participants.away.color
      ? game.timeLeft[participants.away.color] - (now - new Date(game.lastMoveAt).getTime())
      : game.timeLeft[participants.away.color];

  return { home, away } as const;
};

export const getPlayersTimeLeftByColor = (game: WarGameRecord) => {
  const now = new Date().getTime();

  return {
    white:
      game.state === 'started' && game.lastMoveBy !== 'white'
        ? game.timeLeft.white - (now - new Date(game.lastMoveAt).getTime())
        : game.timeLeft.white,
    black:
      game.state === 'started' && game.lastMoveBy !== 'black'
        ? game.timeLeft.black - (now - new Date(game.lastMoveAt).getTime())
        : game.timeLeft.black,
  } as const;
};