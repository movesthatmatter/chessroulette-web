import { deepMerge } from 'grommet/utils';
import { grommet, ThemeType } from 'grommet';
import { text } from './text';

const customTheme: ThemeType = {
  global: {
    colors: {
      brand: 'rgb(84, 196, 242)',
      text: {
        dark: '#f8f8f8',
        light: text.primaryColor,
      },
    },
    font: {
      family: 'Lato, Open Sans, sans-serif',
    },
  },
  button: {
    default: {
      color: 'brand',
      border: {
        color: 'brand',
        width: '2px',
      },
    },
    primary: {
      background: { color: 'brand' },
      color: 'light-1',
    },
    secondary: {
      border: { color: 'brand', width: '2px' },
    },
    active: {
      background: { color: 'brand-contrast' },
    },
  },
};

export const defaultTheme = deepMerge(grommet, customTheme);

export * from './colors';
export * from './effects';
export * from './fonts';
export * from './text';
export * from './mediaQueries';