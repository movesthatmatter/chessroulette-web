import React from 'react';
import { addDecorator } from '@storybook/react';
import { configure } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import WebFont from 'webfontloader'

WebFont.load({
    google: {
      families: ['Open Sans:300,400,700', 'Roboto:300,400,700','Roboto Slab:300,400,700','sans-serif'],
    }
  });

  
addDecorator(
    withInfo({
      header: false,
      inline: false,
    })
);

configure(
    [
        require.context('../src', true, /\.story\.tsx$/),
    ] , module );

addDecorator(storyFn => <div style={style}>{storyFn()}</div>);

const style = {
    fontFamily: 'Open Sans'
}