import { deepMerge } from 'grommet/utils';
import { grommet, ThemeType } from 'grommet';

const customTheme: ThemeType = {
  global: {
    colors: {
      brand: 'rgb(84, 196, 242)',
      // text: 'white',
    },
    font: {
      family: 'Roboto, Open Sans, Roboto Slab, sans-serif',
    },
    // button: {
    //   extend:
    // }
  },
};

export const defaultTheme = deepMerge(grommet, customTheme);
