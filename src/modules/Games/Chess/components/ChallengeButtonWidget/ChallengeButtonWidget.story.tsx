/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { action } from '@storybook/addon-actions';
import { ChallengeButtonWidget } from './ChallengeButtonWidget';

export default {
  component: ChallengeButtonWidget,
  title: 'components/ChallengeButtonWidget',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div style={{ width: '200px' }}>
      <ChallengeButtonWidget
        buttonLabel="Play a Friend"
        userId="1"
        type="private"
        // onSubmit={action('on submit')}
      />
      <ChallengeButtonWidget
        buttonLabel="Create Challenge"
        // onSubmit={action('on submit')}
        userId="1"
        type="public"
      />
    </div>
  </Grommet>
);
