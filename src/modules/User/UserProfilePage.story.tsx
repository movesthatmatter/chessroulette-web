import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { UserRecordMocker } from 'src/mocks/records';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { defaultTheme } from 'src/theme';
import { UserProfilePage } from './UserProfilePage';

export default {
  component: UserProfilePage,
  title: 'modules/UserProfile/UserProfile',
};

const userMocker = new UserRecordMocker();

const myUser = userMocker.record();

export const defaultStory = () => (
  <StorybookReduxProvider
    initialState={{
      authentication: {
        authenticationType: 'guest',
        user: myUser,
      },

      // TODO: the game will be added here
    }}
  >
    <Grommet theme={defaultTheme}>
      <UserProfilePage />
    </Grommet>
  </StorybookReduxProvider>
);
