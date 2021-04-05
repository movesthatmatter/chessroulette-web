const defaultSpacerSize = 16;
const defaultSpacer = `${defaultSpacerSize}px`;

const getSpacer = (n = 1) => `${defaultSpacerSize * n}px`;

export const spacers = {
  small: getSpacer(.5),
  smaller: getSpacer(.25),
  smallest: getSpacer(.125),
  default: defaultSpacer,
  large: getSpacer(1.5),
  larger: getSpacer(2),
  largest: getSpacer(3),
};
