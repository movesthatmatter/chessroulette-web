import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { TwitchChatEmbed } from './TwitchChatEmbed';

export default {
  component: TwitchChatEmbed,
  title: 'vendors/twitch/TwitchChatEmbed',
};

export const lightTheme = () => (
  <div
    style={{
      width: '300px',
      height: '500px',
    }}
  >
    <TwitchChatEmbed
      channel="gmminhle"
      height="100%"
      width="100%"
      theme="light"
      targetId="gmminhle"
      onReady={action('on ready')}
    />
  </div>
);

export const darkTheme = () => (
  <div
    style={{
      width: '300px',
      height: '500px',
    }}
  >
    <TwitchChatEmbed
      channel="gmminhle"
      height="100%"
      width="100%"
      theme="dark"
      targetId="gmminhle"
    />
  </div>
);
