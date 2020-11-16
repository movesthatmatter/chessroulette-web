export type ContainerDimensions = {
  width: number;
  height: number;
};

export type Dimensions = ContainerDimensions & {
  verticalPadding: number;
};

export type Ratios = {
  leftSide: number;
  gameArea: number;
  rightSide: number;
};

export const getMaxKey = <O extends { [k: string]: number }>(obj: O) =>
  Object.keys(obj).reduce(
    (prev, next) => (obj[next] > obj[prev] ? next : prev),
    Object.keys(obj)[0] as keyof O
  );

  export const normalizeRatios = (r: Ratios): Ratios => {
  const maxKey = getMaxKey(r);
  const maxVal = r[maxKey];

  return {
    leftSide: r.leftSide / maxVal,
    rightSide: r.rightSide / maxVal,
    gameArea: r.gameArea / maxVal,

    // Replace the maxKey with 1
    [maxKey]: 1,
  };
};

export const getLayoutSizes = (
  containerDimensions: ContainerDimensions,
  ratios: Ratios,
): {
  leftSide: number;
  gameArea: number;
  rightSide: number;
  remaining: number;
} => {
  const normalizedRatios = normalizeRatios(ratios);
  const ratio = normalizedRatios.gameArea + normalizedRatios.leftSide + normalizedRatios.rightSide;
  const maxWidth = containerDimensions.height * ratio;
  const diff = containerDimensions.width - maxWidth;

  if (diff >= 0) {
    return {
      leftSide: Math.floor(normalizedRatios.leftSide * (maxWidth / ratio)),
      gameArea: Math.floor(normalizedRatios.gameArea * (maxWidth / ratio)),
      rightSide: Math.floor(normalizedRatios.rightSide * (maxWidth / ratio)),
      remaining: diff,
    };
  }

  const nextContainerHeight = containerDimensions.height - Math.abs(diff / ratio);
  return getLayoutSizes(
    {
      ...containerDimensions,
      height: nextContainerHeight,
    },
    ratios
  );
};