/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { Grommet, Box } from 'grommet';
import { defaultTheme } from 'src/theme';
import { CreateChallenge } from './CreateChallenge';

export default {
  component: CreateChallenge,
  title: 'modules/Challenges/components/Create Challenge',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <Box pad="medium" align="center">
      <CreateChallenge
        activityType='play'
        gameSpecs={{
          timeLimit: 'blitz3',
          preferredColor: 'black',
        }}
        onUpdated={action('on update')}
      />
    </Box>
  </Grommet>
);
