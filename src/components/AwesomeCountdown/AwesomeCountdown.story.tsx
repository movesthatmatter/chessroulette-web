import { toISODateTime } from 'io-ts-isodatetime';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Date } from 'window-or-global';
import { AwesomeCountdown } from './AwesomeCountdown';


export default {
  component: AwesomeCountdown,
  title: 'components/AwesomeCountdown',
};

const deadline = toISODateTime(new Date('24 November 2021 13:00:00'));

export const defaultStory = () => (
  <AwesomeCountdown deadline={deadline} />
)