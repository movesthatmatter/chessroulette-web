import { configure } from '@storybook/react';

configure(require.context('../src/components/ui', true, /\.stories\.js$/), module);

module.exports = {
  stories: ['../src/**/*.stories.js'],  
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
};
