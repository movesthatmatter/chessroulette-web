/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { minutes, second, seconds } from 'src/lib/time';
import { Countdown } from './Countdown';


export default {
  component: Countdown,
  title: 'modules/Games/Chess/Countdown',
};

export const bullet = () => (
    <Countdown timeLeft={seconds(56)} active gameTimeClass="bullet30"/>
);

export const blitz = () => (
    <Countdown timeLeft={minutes(1.03)} active gameTimeClass="blitz2"/>
);
