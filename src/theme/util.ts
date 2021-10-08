import { Object } from 'window-or-global';
import { CustomTheme, Theme, DefaultTheme } from '.';

export const getBoxShadow = (x: number, y: number, blur: number, inset: number, color: string) => {
  return `${x}px ${y}px ${blur}px ${inset}px ${color}`;
};

export const deepMergeTheme = (
  defaultTheme: DefaultTheme,
  customTheme: Theme
): Omit<CustomTheme, 'name'> => {
  const { name, ...defaultThemeWithoutName } = defaultTheme;
  return Object.assign({}, { ...defaultThemeWithoutName }, { ...customTheme });
};
