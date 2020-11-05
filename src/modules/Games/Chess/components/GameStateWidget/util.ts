import { CapturedPiecesRecord } from "dstnd-io";

const pointsByMaterial = {
  p: 1,
  b: 3,
  n: 3,
  r: 5,
  q: 9,
};

const getMaterialLossInPointsBySide = (captured: CapturedPiecesRecord[keyof CapturedPiecesRecord]) => {
  return Object.keys(captured).reduce((prev, next) => {
    const nextPiece = next as keyof typeof captured;
    const count = captured[nextPiece];

    if (count === 0) {
      return prev;
    }

    return prev - (pointsByMaterial[nextPiece] * count);
  }, 0);
}

export const getRelativeMaterialScore = (captured?: CapturedPiecesRecord) => {
  if (!captured) {
    return {
      white: 0,
      black: 0,
    }
  }

  const blackMaterialLoss = getMaterialLossInPointsBySide(captured['black']);
  const whiteMateriaLoss = getMaterialLossInPointsBySide(captured['white']);

  // Normalize the points
  const diff = Math.abs(blackMaterialLoss - whiteMateriaLoss);

  if (whiteMateriaLoss > blackMaterialLoss) {
    return { white: diff, black: 0 };
  }

  if (blackMaterialLoss > whiteMateriaLoss) {
    return { white: 0, black: diff };
  }

  return {
    white: 0,
    black: 0,
  }
}
