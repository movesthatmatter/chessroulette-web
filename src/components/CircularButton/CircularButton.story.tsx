/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { CircularButton } from './CircularButton';


export default {
  component: CircularButton,
  title: 'Components/Circular Button',
};

export const videoButton = () => (
  <CircularButton
    color="#E66162"
    type="video"
    onClick={action('button clicked!')}
  />
);

export const chatButton = () => (
  <CircularButton
    color="#08D183"
    type="chat"
    onClick={action('button clicked')}
  />
);

export const playButton = () => (
  <CircularButton
    color="#54C4F2"
    type="play"
    onClick={action('button clicked')}
  />
);
