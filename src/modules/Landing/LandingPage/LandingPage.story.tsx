/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { UserRecordMocker } from 'src/mocks/records';
import { LandingPage } from './LandingPage';

export default {
  component: LandingPage,
  title: 'modules/Landing Page',
};

const userRecordMocker = new UserRecordMocker();

const userA = userRecordMocker.record(false);

export const defaultStory = () => (
  <StorybookReduxProvider
    initialState={{
      authentication: {
        authenticationType: 'user',
        user: userA,
        accessToken: 'my token',
      },
    }}
  >
    <Grommet theme={defaultTheme} full>
      <LandingPage />
    </Grommet>
  </StorybookReduxProvider>
);
