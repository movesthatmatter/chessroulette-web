/* eslint-disable import/no-extraneous-dependencies */
import { Grommet } from 'grommet';
import React from 'react';
import { minutes, second, seconds } from 'src/lib/time';
import { defaultTheme } from 'src/theme';
import { Countdown } from './Countdown';


export default {
  component: Countdown,
  title: 'modules/Games/Chess/Countdown',
};

export const bullet = () => (
  <Grommet theme={defaultTheme}>
    <Countdown timeLeft={seconds(56)} active gameTimeClass="bullet30"/>
  </Grommet>
);

export const blitz = () => (
  <Grommet theme={defaultTheme}>
    <Countdown timeLeft={minutes(1.03)} active gameTimeClass="blitz2"/>
  </Grommet>
);
