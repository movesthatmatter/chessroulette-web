import { deepMerge } from 'grommet/utils';
import { grommet } from 'grommet';

export const defaultTheme = deepMerge(grommet, {
  global: {
    font: {
      family: 'Roboto, Open Sans, Roboto Slab, sans-serif',
    },
  },
});
