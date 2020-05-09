/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { JoinFirstAvailableRoomHelper } from 'src/storybook/JoinDefaultRoomHelper';
import { RoomStats } from './RoomStats';
import { SocketProvider } from '../SocketProvider';

export default {
  component: RoomStats,
  title: 'Components/RoomStats',
};

export const defaultStory = () => (
  <SocketProvider>
    <JoinFirstAvailableRoomHelper
      render={({ room, me }) => (
        <RoomStats
          room={room}
          me={me}
        />
      )}
    />
  </SocketProvider>
);
