/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { UserRecordMocker } from 'src/mocks/records';
import { LandingPage } from './LandingPage';
import { AuthenticationToken } from 'chessroulette-io';

export default {
  component: LandingPage,
  title: 'modules/Landing Page',
};

const userRecordMocker = new UserRecordMocker();

const userA = userRecordMocker.record(false);

export const defaultStory = () => (
  <StorybookReduxProvider initialState={{}}>
      <LandingPage />
  </StorybookReduxProvider>
);

export const withUser = () => (
  <StorybookReduxProvider
    initialState={{
      authentication: {
        authenticationType: 'user',
        user: userA,
        authenticationToken: 'my token' as AuthenticationToken,
      },
    }}
  >
      <LandingPage />
  </StorybookReduxProvider>
);
