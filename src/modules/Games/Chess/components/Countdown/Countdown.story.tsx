/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { days, minutes, second, seconds } from 'src/lib/time';
import { Countdown } from './Countdown';


export default {
  component: Countdown,
  title: 'modules/Games/Chess/Countdown',
};

export const bullet = () => (
    <Countdown timeLeft={seconds(16)} active gameTimeClass="bullet30"/>
);

export const blitz = () => (
    <Countdown timeLeft={minutes(1.03)} active gameTimeClass="blitz2"/>
);

export const hourDuration = () => (
  <Countdown timeLeft={minutes(119.3)} active gameTimeClass="untimed"/>
);

export const daysDuration = () => (
  <Countdown timeLeft={days(2.4)} active gameTimeClass="untimed"/>
);
