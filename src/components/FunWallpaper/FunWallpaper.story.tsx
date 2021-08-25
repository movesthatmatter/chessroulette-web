/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { FunWallpaper } from './FunWallpaper';

export default {
  component: FunWallpaper,
  title: 'components/FunWallpaper',
};

export const defaultStory = () => (
  <StorybookBaseProvider>
    <FunWallpaper>inside</FunWallpaper>
  </StorybookBaseProvider>
);
