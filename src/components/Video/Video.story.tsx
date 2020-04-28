/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { Video } from './Video';


export default {
  component: Video,
  title: 'Components/Video',
};

export const main = () => (
  <Video />
);

// export const chatButton = () => (
//   <CircularButton
//     color="#08D183"
//     type="chat"
//     onClick={action('button clicked')}
//   />
// );

// export const playButton = () => (
//   <CircularButton
//     color="#54C4F2"
//     type="play"
//     onClick={action('button clicked')}
//   />
// );
