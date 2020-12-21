/* eslint-disable import/no-extraneous-dependencies */
import { Grommet } from 'grommet';
import React from 'react';
import { minutes } from 'src/lib/time';
import { defaultTheme } from 'src/theme';
import { Countdown } from './Countdown';


export default {
  component: Countdown,
  title: 'modules/Games/Chess/Countdown',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <Countdown timeLeft={minutes(5)} active />
  </Grommet>
);
