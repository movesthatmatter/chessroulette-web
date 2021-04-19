import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { WelcomeNewUserDialog } from './WelcomeNewUserDialog';


export default {
  component: WelcomeNewUserDialog,
  title: 'services/Authentication/widgets/WelcomeNewUserDialog',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <WelcomeNewUserDialog visible/>
  </Grommet>
);
