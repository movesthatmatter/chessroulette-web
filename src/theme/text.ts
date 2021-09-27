const primaryColorLight = '#25282B';

const disabledColorLight = '#A4A8B5';

const baseColorLight = '#001B36';

export const light = {
  primaryColor: primaryColorLight,
  baseColor: baseColorLight,
  disabledColor: disabledColorLight
};

const primaryColorDark = '#E2E8F0';

const baseColorDark = '#E2E8F0';

const disabledColorDark = '#A4A8B5';

export const dark = {
  primaryColor: primaryColorDark,
  baseColor: baseColorDark,
  disabledColor: disabledColorDark,
}

export type TextColor = typeof light;

export const fontFamily = {
  family: 'Lato, Open Sans, sans-serif',
}