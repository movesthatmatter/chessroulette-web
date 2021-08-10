/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker } from 'src/mocks/records';
import { PlayActivity } from './PlayActivity';
import { RoomPlayActivity } from '../types';

export default {
  component: PlayActivity,
  title: 'modules/Room/Activities/PlayActivity',
};

const gameMocker = new GameMocker();
const game = gameMocker.started();
// const activity: RoomPlayActivity = {
//   type: 'play',
//   gameId: game.id,
//   participants: {},
//   game,
// }

// TODO: Fix this too

export const defaultStory = () => (
  null
  // <PlayActivity activity={activity} size={500} />
);
