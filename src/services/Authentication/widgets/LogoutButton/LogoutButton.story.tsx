import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { LogoutButton } from './LogoutButton';


export default {
  component: LogoutButton,
  title: 'services/Authentication/widgets/LogoutBtton',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <LogoutButton />
  </Grommet>
);
