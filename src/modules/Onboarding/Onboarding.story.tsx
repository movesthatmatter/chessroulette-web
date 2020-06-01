/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import StoryRouter from 'storybook-react-router';
import { Onboarding } from './Onboarding';

export default {
  component: Onboarding,
  title: 'modules/Onboarding',
  decorators: [StoryRouter()],
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <Onboarding />
  </Grommet>
);
