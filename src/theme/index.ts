import { deepMerge } from 'grommet/utils';
import { grommet, ThemeType } from 'grommet';

const customTheme: ThemeType = {
  global: {
    colors: {
      brand: 'rgb(84, 196, 242)',
      text: {
        dark: '#f8f8f8',
        light: '#444444',
      },
    },
    font: {
      // family: 'Roboto, Open Sans, Roboto Slab, sans-serif',
      family: 'Lato, Open Sans, Roboto Slab, sans-serif',
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
