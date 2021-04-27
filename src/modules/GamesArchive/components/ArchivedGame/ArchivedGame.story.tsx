import { ChessGameStateFinished, GameRecordFromGameState } from 'dstnd-io';
import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker } from 'src/mocks/records';
import { colors, defaultTheme } from 'src/theme';
import { ArchivedGame } from './ArchivedGame';


export default {
  component: ArchivedGame,
  title: 'modules/GamesArchive/ArchivedGame',
};

const gameMocker = new GameMocker();

export const defaultStory = () => (
  <div style={{
    width: '760px',
    background: 'red',
  }}>
  <Grommet theme={defaultTheme}>
    <ArchivedGame game={gameMocker.finished()} />
  </Grommet>
  </div>
);

export const multipleGamesStory = () => (
  <div style={{
    width: '760px',
    background: 'red',
  }}>
  <Grommet theme={defaultTheme}>
    <ArchivedGame game={gameMocker.finished()} />
    <ArchivedGame game={gameMocker.stopped()} />
    <ArchivedGame game={gameMocker.finished()} />
  </Grommet>
  </div>
);

