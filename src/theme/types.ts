import { Colors } from './colors';
import { defaultThemeDark } from './themes/dark';

// type ThemeWithoutName = Omit<typeof darkDefault,'name'>;
export type DefaultTheme = typeof defaultThemeDark & {
  name: 'darkDefault' | 'lightDefault';
};

export type CustomTheme = DefaultTheme;

type PartialProps<T extends Omit<typeof defaultThemeDark, 'colors'>> = {
  [k in keyof T]: Partial<T[k]>;
};

export type Theme = {
  colors: Colors;
} & PartialProps<Omit<typeof defaultThemeDark, 'colors'>>;
