/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker } from 'src/mocks/records';
import { RoomPlayActivity } from '../redux/types';
import { PlayActivity } from './PlayActivity';

export default {
  component: PlayActivity,
  title: 'modules/Room/Activities/PlayActivity',
};

const gameMocker = new GameMocker();
const game = gameMocker.started();
const activity: RoomPlayActivity = {
  type: 'play',
  gameId: game.id,
  game,
}

export const defaultStory = () => (
  <PlayActivity game={game} activity={activity} size={500} />
);
