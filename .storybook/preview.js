import React from 'react';
import { addDecorator } from '@storybook/react';
import { configure } from '@storybook/react';
import WebFont from 'webfontloader'
import {StorybookThemeProvider} from '../src/storybook/StorybookThemeProvider';

WebFont.load({
  google: {
    families: [
      'Lato:300', 'Lato:400', 'Lato:700',
      'Open Sans:300', 'Open Sans:400', 'Open Sans:700',
      'Roboto:300', 'Roboto:400', 'Roboto:700',
      'Roboto Slab:300', 'Roboto Slab:400', 'Roboto Slab:700',
      'sans-serif',
    ],
  },
});

configure(
    [
        require.context('../src', true, /\.story\.tsx$/),
    ] , module );

addDecorator(storyFn => (
  <StorybookThemeProvider>
    {storyFn()}
  </StorybookThemeProvider>
));
