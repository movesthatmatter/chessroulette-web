/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { UserRecordMocker } from 'src/mocks/records';
import { UserDisplay } from './UserDisplay';

export default {
  component: UserDisplay,
  title: 'components/UserDisplay',
};

const userMocker = new UserRecordMocker();

export const defaultStory = () => <UserDisplay user={userMocker.record()} />;
