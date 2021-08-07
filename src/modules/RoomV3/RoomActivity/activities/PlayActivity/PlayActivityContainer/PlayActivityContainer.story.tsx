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
const game = gameMocker.started();

// TODO: Fix this as well

export const defaultStory = () => (
  <StorybookReduxProvider>
    
    {/* <PlayActivityContainer
      activity={{
        type: 'play',
        game: game,
        participants: {},
      }}
      size={500}
    /> */}
  </StorybookReduxProvider>
);
