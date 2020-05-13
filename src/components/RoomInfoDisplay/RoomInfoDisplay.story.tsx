/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { RoomStatsRecord } from 'dstnd-io';
import { action } from '@storybook/addon-actions';
import { RoomInfoDisplay, RoomInfoProps } from './RoomInfoDisplay';


export default {
  component: RoomInfoDisplay,
  title: 'Components/Room Info Display',
};

const peers = {
  1: {
    id: '1',
    name: 'Broasca',
  },
  2: {
    id: '2',
    name: 'Piper',
  },
  3: {
    id: '3',
    name: 'Jartica',
  },
  4: {
    id: '4',
    name: 'Teleenciclopedia',
  },
  // 5: {
  //   id: '5',
  //   name: 'Samurai',
  // },
  // 6: {
  //   id: '6',
  //   name: 'Lebada',
  // },
} as const;

const room: RoomStatsRecord = {
  id: '0',
  name: 'Valencia',
  type: 'public',
  peersCount: Object.keys(peers).length,
  peers,
} as const;

const mockedProps: RoomInfoProps = {
  me: {
    id: '1',
    name: 'Batman',
  },
  room,
  onLeaveRoom: action('leave room'),
  onInviteNewPeer: action('invite new peer'),
  onChallenge: action('challenge peer'),
};
export const RoomInfoComponent = () => (
  <div>
    <RoomInfoDisplay {...mockedProps} />
  </div>

);
