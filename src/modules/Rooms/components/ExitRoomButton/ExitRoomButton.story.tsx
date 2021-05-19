import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { ExitRoomButton } from './ExitRoomButton';

export default {
  component: ExitRoomButton,
  title: 'modules/Rooms/components/ExitRoomButton',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <ExitRoomButton />
  </Grommet>
);
