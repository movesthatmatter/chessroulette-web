import React from 'react';
import { GameRoom } from './GameRoom';
import { GameRoomContainer } from './GameRoomContainer';

export default {
  component: GameRoom,
  title: 'Modules/GameRoomContainer',
};

export const defaultStory = () => (
  <GameRoomContainer />
);
