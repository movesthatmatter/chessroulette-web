/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { LandingPageV2 } from './LandingPageV2';

export default {
  component: LandingPageV2,
  title: 'modules/Landing Page V2',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <LandingPageV2 />
  </Grommet>
);
