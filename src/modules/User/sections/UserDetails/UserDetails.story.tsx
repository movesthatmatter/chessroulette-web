import { RegisteredUserRecord } from 'dstnd-io';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { UserRecordMocker } from 'src/mocks/records';
import { UserDetails } from './UserDetails';


export default {
  component: UserDetails,
  title: 'modules/UserProfile/sections/UserDetails',
};

const userMocker = new UserRecordMocker();

const myUser = userMocker.record() as unknown as RegisteredUserRecord;


export const defaultStory = () => (
  <UserDetails user={myUser} />
)