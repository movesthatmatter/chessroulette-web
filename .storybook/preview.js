import React from 'react';
import { addDecorator } from '@storybook/react';
import { configure } from '@storybook/react';


configure(require.context('../src/components/ui', true, /\.stories\.js$/), module);
configure(require.context('../src/stories/', true, /\.stories\.js$/), module);

addDecorator(storyFn => <div style={style}>{storyFn()}</div>);

const style = {
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center',
    textAlign : 'center',
}