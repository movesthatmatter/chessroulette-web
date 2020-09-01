/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { PlayButtonWidget } from './PlayButtonWidget';

export default {
  component: PlayButtonWidget,
  title: 'components/PlayButtonWidget',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div style={{ width: '200px' }}>
      <PlayButtonWidget type="friendly" />
      <PlayButtonWidget type="challenge" />
    </div>
  </Grommet>
);
