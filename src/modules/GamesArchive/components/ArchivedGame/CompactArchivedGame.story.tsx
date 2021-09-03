import { ChessGameStateFinished, GameRecordFromGameState } from 'dstnd-io';
import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker } from 'src/mocks/records';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { colors, defaultTheme } from 'src/theme';
import { ArchivedGame } from './ArchivedGame';
import { CompactArchivedGame } from './CompactArchivedGame';

export default {
  component: ArchivedGame,
  title: 'modules/GamesArchive/CompactArchivedGame',
};

const gameMocker = new GameMocker();

const finishedGameA = gameMocker.finished();
const stoppedGameA = gameMocker.stopped();
const drawnGameA: GameRecordFromGameState<ChessGameStateFinished> = {
  ...gameMocker.finished(),
  winner: '1/2',
};

export const defaultStory = () => (
  <StorybookBaseProvider>
    <div
      style={{
        width: '760px',
      }}
    >
      <CompactArchivedGame game={finishedGameA} myUserId={finishedGameA.players[0].user.id} />
    </div>
  </StorybookBaseProvider>
);

export const multipleGamesStory = () => (
  <StorybookBaseProvider>
    <div
      style={{
        width: '300px',
      }}
    >
      <CompactArchivedGame game={finishedGameA} myUserId={finishedGameA.players[0].user.id} />
      <CompactArchivedGame game={stoppedGameA} myUserId={stoppedGameA.players[0].user.id} />
      <CompactArchivedGame game={drawnGameA} myUserId={drawnGameA.players[0].user.id} />
    </div>
  </StorybookBaseProvider>
);
