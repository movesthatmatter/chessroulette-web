const defaultSizePx = 16;
const defaultSize = `${defaultSizePx}px`;

const getSizePx = (n = 1) => defaultSizePx * n;
const getSize = (n = 1) => `${getSizePx(n)}px`;

export const getSizers = (n = 1) => ({
  smallPx: getSizePx(n * 0.5),
  smallerPx: getSizePx(n * 0.25),
  smallestPxPx: getSizePx(n * 0.125),
  defaultPx: getSizePx(n),
  largePx: getSizePx(n * 1.5),
  largerPx: getSizePx(n * 2),
  largestPx: getSizePx(n * 3),

  small: getSize(n * 0.5),
  smaller: getSize(n * 0.25),
  smallest: getSize(n * 0.125),
  default: getSize(n),
  large: getSize(n * 1.5),
  larger: getSize(n * 2),
  largest: getSize(n * 3),

  get: (m: number) => getSize(m * n),
  getPx: (m: number) => getSizePx(m * n),
});

export const sizers = getSizers();
