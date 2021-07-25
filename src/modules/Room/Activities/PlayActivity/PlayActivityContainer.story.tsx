/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker } from 'src/mocks/records';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { PlayActivityContainer } from './PlayActivityContainer';

export default {
  component: PlayActivityContainer,
  title: 'modules/Room/Activities/PlayActivityContainer',
};

const gameMocker = new GameMocker();

export const defaultStory = () => (
  <StorybookReduxProvider>
    <PlayActivityContainer
      activity={{
        type: 'play',
        gameId: '23',
      }}
      size={500}
    />
  </StorybookReduxProvider>
);
