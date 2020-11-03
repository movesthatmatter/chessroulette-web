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

// TODO: Look into ways to optimize this a bit
//  since it recursively gets called a lot of times
//  before it reaches the end.
// Maybe something like a logarithmic offset
export const getLayoutSizes = (
  containerDimensions: ContainerDimensions,
  ratios: Ratios,
  offset = 0
): {
  leftSide: number;
  gameArea: number;
  rightSide: number;
} => {
  const gameArea =
    (Math.min(containerDimensions.height, containerDimensions.width) - offset) * ratios.gameArea;
  const leftSide = gameArea * ratios.leftSide;
  const rightSide = gameArea * ratios.rightSide;

  if (gameArea + leftSide + rightSide <= containerDimensions.width) {
    return {
      gameArea,
      leftSide,
      rightSide,
    };
  }

  return getLayoutSizes(
    {
      width: containerDimensions.width,
      height: containerDimensions.height,
    },
    ratios,
    offset + (0.01 * containerDimensions.width),
  );
};
