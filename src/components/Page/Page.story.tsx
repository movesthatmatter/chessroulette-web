/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Page } from './Page';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';

export default {
  component: Page,
  title: 'components/Page',
};

export const defaultStory = () => (
    <div style={{ width: '100%', height: '100vh' }}>
      <StorybookReduxProvider>
        <Page doNotTrack />
        <Page name="Story" />
      </StorybookReduxProvider>
    </div>
);
