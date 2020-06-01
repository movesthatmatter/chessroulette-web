/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import StoryRouter from 'storybook-react-router';
import { action } from '@storybook/addon-actions';
import { Ok } from 'ts-results';
import { ReduxProvider } from 'src/redux/Provider';
import { Onboarding } from './Onboarding';

export default {
  component: Onboarding,
  title: 'modules/Onboarding',
  decorators: [StoryRouter()],
};

export const defaultStory = () => (
  <ReduxProvider>
    <Grommet theme={defaultTheme} full>
      <Onboarding
        onSetUser={(...args) => {
          action('on set user')(...args);

          return Promise.resolve(new Ok({
            id: '1',
            name: 'Mock User',
          }));
        }}
      />
    </Grommet>
  </ReduxProvider>
);
