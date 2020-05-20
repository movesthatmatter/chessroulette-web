/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { SocketProvider } from 'src/components/SocketProvider';
import { JoinFirstAvailableRoomHelper } from 'src/storybook/JoinDefaultRoomHelper';
import { GameRoomContainer } from './GameRoomContainer';

export default {
  component: GameRoomContainer,
  title: 'Modules/GameRoom/GameRoomContainer',
};

export const deafultStory = () => (
  <SocketProvider>
    <JoinFirstAvailableRoomHelper
      render={({ room }) => <GameRoomContainer id={room.id} />}
    />
  </SocketProvider>
);
