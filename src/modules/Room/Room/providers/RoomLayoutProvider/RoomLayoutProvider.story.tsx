/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker } from 'src/mocks/records';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { RoomLayoutProvider } from './RoomLayoutProvider';
import { JoinedRoom } from '../../../types';

export default {
  component: RoomLayoutProvider,
  title: 'modules/Room/RoomLayoutProvider',
};

const gameMocker = new GameMocker();
const roomMocker = new RoomMocker();

const game = gameMocker.started();
const joinedRoom: JoinedRoom = {
  ...roomMocker.record(),
  currentActivity: {
    type: 'play',
    gameId: game.id,
    game,
  },
};

export const roomWithPlayActivity = () => (
  <StorybookBaseProvider withAuthentication>
    <RoomLayoutProvider joinedRoom={joinedRoom} />
  </StorybookBaseProvider>
);
