/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { Page } from './Page';

export default {
  component: Page,
  title: 'components/Page',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div style={{ width: '100%', height: '100vh' }}>
      <Page />
    </div>
  </Grommet>
);
