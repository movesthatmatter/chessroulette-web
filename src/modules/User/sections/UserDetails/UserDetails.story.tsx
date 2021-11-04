import { AuthenticationToken, RegisteredUserRecord } from 'dstnd-io';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { UserRecordMocker } from 'src/mocks/records';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { UserDetails } from './UserDetails';

export default {
  component: UserDetails,
  title: 'modules/UserProfile/sections/UserDetails',
};

const userMocker = new UserRecordMocker();
const myUser = (userMocker.record() as unknown) as RegisteredUserRecord;

export const defaultStory = () => (
    <StorybookReduxProvider
      initialState={{
        authentication: {
          authenticationType: 'user',
          user: myUser,
          authenticationToken: 'asda' as AuthenticationToken,
        },
        // TODO: the game will be added hereƒ
      }}
    >
      {React.createElement(() => {
        const authenticatedUser = useAuthenticatedUser();

        if (!authenticatedUser) {
          return null;
        }

        return <UserDetails user={authenticatedUser} />;
      })}
    </StorybookReduxProvider>
);
