/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { UserRecordMocker } from 'src/mocks/records';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { NavigationMenu } from './NavigationMenu';


export default {
  component: NavigationMenu,
  title: 'components/Navigation/NavigationMenu',
};

const userMocker = new UserRecordMocker();

export const defaultStory = () => (
    <StorybookReduxProvider initialState={{
      authentication: {
        authenticationType: 'guest',
        user: userMocker.record(),
      }
    }}>
      <NavigationMenu />
    </StorybookReduxProvider>
);