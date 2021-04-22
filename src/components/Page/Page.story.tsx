/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { Page } from './Page';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { Router } from 'react-router-dom';

export default {
  component: Page,
  title: 'components/Page',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div style={{ width: '100%', height: '100vh' }}>
      <StorybookReduxProvider>
        <Page />
      </StorybookReduxProvider>
    </div>
  </Grommet>
);
