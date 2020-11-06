/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { Grommet, Box } from 'grommet';
import { defaultTheme } from 'src/theme';
import { ChessChallengeCreator } from './ChessChallengeCreator';

export default {
  component: ChessChallengeCreator,
  title: 'modules/Games/Chess/components/Challenge Creator',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <Box pad="medium" align="center">
      <ChessChallengeCreator onUpdate={action('on update')} />
    </Box>
  </Grommet>
);
