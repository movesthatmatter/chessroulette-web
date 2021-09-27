/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { WelcomeNewUserDialog } from './WelcomeNewUserDialog';


export default {
  component: WelcomeNewUserDialog,
  title: 'services/Authentication/widgets/WelcomeNewUserDialog',
};

export const defaultStory = () => (
  <WelcomeNewUserDialog visible/>
);
