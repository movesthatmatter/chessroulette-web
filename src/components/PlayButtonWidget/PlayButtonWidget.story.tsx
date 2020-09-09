/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { action } from '@storybook/addon-actions';
import { PlayButtonWidget } from './PlayButtonWidget';

export default {
  component: PlayButtonWidget,
  title: 'components/PlayButtonWidget',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div style={{ width: '200px' }}>
      <PlayButtonWidget
        buttonLabel="Play a Friend"
        onSubmit={action('on submit')}
      />
      <PlayButtonWidget
        buttonLabel="Create Challenge"
        onSubmit={action('on submit')}
      />
    </div>
  </Grommet>
);
