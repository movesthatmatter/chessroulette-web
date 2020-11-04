/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { UserRecordMocker } from 'src/mocks/records';
import { LandingPageV2 } from './LandingPageV2';

export default {
  component: LandingPageV2,
  title: 'modules/Landing Page V2',
};

const userRecordMocker = new UserRecordMocker();

const userA = userRecordMocker.record(false);

export const defaultStory = () => (
  <StorybookReduxProvider
    initialState={{
      authentication: {
        authenticationType: 'user',
        user: userA,
      },
    }}
  >
    <Grommet theme={defaultTheme} full>
      <LandingPageV2 />
    </Grommet>
  </StorybookReduxProvider>
);
