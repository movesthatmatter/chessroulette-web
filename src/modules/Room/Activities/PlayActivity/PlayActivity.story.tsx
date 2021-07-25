/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker } from 'src/mocks/records';
import { PlayActivity } from './PlayActivity';

export default {
  component: PlayActivity,
  title: 'modules/Room/Activities/PlayActivity',
};

const gameMocker = new GameMocker();

export const defaultStory = () => (
  <PlayActivity game={gameMocker.started()} size={500} />
);
