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

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div
      style={{
        paddingBottom: '1em',
      }}
    >
      <Countdown timeLeft={seconds(30)} active gameTimeClass="bullet30" />
    </div>
    <div
      style={{
        paddingBottom: '1em',
      }}
    >
      <Countdown timeLeft={seconds(56)} active gameTimeClass="blitz2" />
    </div>
  </Grommet>
);

export const bullet = () => (
  <Grommet theme={defaultTheme}>
    <Countdown timeLeft={seconds(56)} active gameTimeClass="bullet1" />
  </Grommet>
);

export const blitz = () => (
  <Grommet theme={defaultTheme}>
    <Countdown timeLeft={minutes(1.03)} active gameTimeClass="bullet1" />
  </Grommet>
);
