/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { Grommet, Box } from 'grommet';
import { defaultTheme } from 'src/theme';
import { FaceTimeSetup } from './FaceTimeSetup';

export default {
  component: FaceTimeSetup,
  title: 'components/FaceTime/FaceTimeSetup',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <Box width="medium">
      <FaceTimeSetup onUpdated={action('on updated')} />
    </Box>
  </Grommet>
);
