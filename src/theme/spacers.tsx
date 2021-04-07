const defaultSpacerSize = 16;
const defaultSpacer = `${defaultSpacerSize}px`;

const getSpacerSize = (n = 1) => defaultSpacerSize * n;
const getSpacer = (n = 1) => `${getSpacerSize(n)}px`;

export const spacers = {
  smallPx: getSpacerSize(.5),
  smallerPx: getSpacerSize(.25),
  smallestPxPx: getSpacerSize(.125),
  defaultPx: defaultSpacerSize,
  largePx: getSpacerSize(1.5),
  largerPx: getSpacerSize(2),
  largestPx: getSpacerSize(3),

  small: getSpacer(.5),
  smaller: getSpacer(.25),
  smallest: getSpacer(.125),
  default: defaultSpacer,
  large: getSpacer(1.5),
  larger: getSpacer(2),
  largest: getSpacer(3),
};
