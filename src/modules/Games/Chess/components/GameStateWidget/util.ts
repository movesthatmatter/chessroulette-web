import { ActivePiecesRecord } from 'dstnd-io';
import { objectKeys } from 'src/lib/util';
import { Game } from 'src/modules/Games/types';

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

export const getRelativeMaterialScore = (game: Game) => {
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
