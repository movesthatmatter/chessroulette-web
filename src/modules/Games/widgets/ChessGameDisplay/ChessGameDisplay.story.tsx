/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker } from 'src/mocks/records';
import { ChessGameDisplay } from '.';

export default {
  component: ChessGameDisplay,
  title: 'modules/Games/widgets/ChessGameDisplay',
};

const gameMocker = new GameMocker();

export const defaultStory = () => (
  <div
    style={{
      width: 300,
    }}
  >
    <ChessGameDisplay game={gameMocker.finished()} />
  </div>
);
