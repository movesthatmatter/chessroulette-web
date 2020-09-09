/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { UserRecordMocker } from 'src/mocks/records';
import { AuthenticationProvider } from 'src/services/Authentication';
import { LandingPageV2 } from './LandingPageV2';

export default {
  component: LandingPageV2,
  title: 'modules/Landing Page V2',
};

const userRecordMocker = new UserRecordMocker();

export const defaultStory = () => (
  <StorybookReduxProvider
    initialState={{
      authentication: {
        authenticationType: 'user',
        user: userRecordMocker.record(false),
      },
    }}
  >
    <Grommet theme={defaultTheme} full>
      <AuthenticationProvider>
        <LandingPageV2 />
      </AuthenticationProvider>
    </Grommet>
  </StorybookReduxProvider>
);
