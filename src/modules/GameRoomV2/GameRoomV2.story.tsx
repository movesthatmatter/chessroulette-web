/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Grommet } from 'grommet';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { defaultTheme } from 'src/theme';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { reduceChessGame, ChessGameState } from 'src/modules/Games/Chess';
import { Page } from 'src/components/Page/Page';
import { GameRoomV2 } from './GameRoomV2';

export default {
  component: GameRoomV2,
  title: 'modules/GameRoomV2/GameRoomV2',
};

const peerMock = new PeerMocker();

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream render={(stream) => React.createElement(() => {
      const me = peerMock.withChannels({
        streaming: {
          on: true,
          type: 'audio-video',
          stream,
        },
      });

      const opponent = peerMock.withChannels({
        streaming: {
          on: true,
          type: 'audio-video',
          stream,
        },
      });

      const [currentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
        playersBySide: {
          away: opponent,
          home: me,
        },
        homeColor: 'white',
        timeLimit: 'blitz',
      }));

      return (
        <GameRoomV2
          me={me}
          opponent={opponent}
          game={currentGame}
        />
      );
    })}
    />
  </Grommet>
);

export const asPage = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream render={(stream) => React.createElement(() => {
      const me = peerMock.withChannels({
        streaming: {
          on: true,
          type: 'audio-video',
          stream,
        },
      });

      const opponent = peerMock.withChannels({
        streaming: {
          on: true,
          type: 'audio-video',
          stream,
        },
      });

      const [currentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
        playersBySide: {
          away: opponent,
          home: me,
        },
        homeColor: 'random',
        timeLimit: 'blitz',
      }));

      return (
        <Page>
          <GameRoomV2
            me={me}
            opponent={opponent}
            game={currentGame}
          />
        </Page>
      );
    })}
    />
  </Grommet>
);
