import { ActivePiecesRecord, ChessGameColor } from 'dstnd-io';
import { objectKeys } from 'src/lib/util';
import { PlayParticipants } from 'src/modules/Games';
import { Game } from 'src/modules/Games/types';
import { getOtherColor } from 'src/modules/LichessPlay/utils';
import { Date } from 'window-or-global';

const pointsByMaterial = {
  p: 1,
  b: 3,
  n: 3,
  r: 5,
  q: 9,
};

const calculatePointsBySide = (activePieces: ActivePiecesRecord[keyof ActivePiecesRecord]) => {
  return objectKeys(activePieces).reduce((prev, pieceType) => {
    return prev + activePieces[pieceType] * pointsByMaterial[pieceType];
  }, 0);
};

export type RelativeMaterialScore = {
  white: number;
  black: number;
};

export const getRelativeMaterialScore = (game: Game): RelativeMaterialScore => {
  const blackPoints = calculatePointsBySide(game.activePieces.black);
  const whitePoints = calculatePointsBySide(game.activePieces.white);

  // Normalize the points
  const diff = Math.abs(blackPoints - whitePoints);

  if (blackPoints > whitePoints) {
    return { white: 0, black: diff };
  }

  if (whitePoints > blackPoints) {
    return { white: diff, black: 0 };
  }

  return {
    white: 0,
    black: 0,
  };
};

export const getPlayersTimeLeft = (game: Game, participants: PlayParticipants) => {
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

export const getPlayersTimeLeftFromGame = (game: Game, homeColor: ChessGameColor) => {
  const now = new Date().getTime();

  const home = game.state === 'started' && game.lastMoveBy !== homeColor 
    ? game.timeLeft[homeColor] - (now - new Date(game.lastMoveAt). getTime())
    : game.timeLeft[homeColor]

  const away = game.state === 'started' && game.lastMoveBy !== getOtherColor(homeColor)
    ? game.timeLeft[getOtherColor(homeColor)] - (now - new Date(game.lastMoveAt).getTime())
    : game.timeLeft[getOtherColor(homeColor)]

  return {home, away} as const;
}
