/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { ChessGame } from 'src/modules/Games/Chess';
import { StreamingBox } from 'src/components/StreamingBox';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { GameRoomLayout } from './GameRoomLayout';

export default {
  component: GameRoomLayout,
  title: 'modules/GameRoomV2/GameRoomLayout',
};

const peerMock = new PeerMocker();

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream render={(stream) => {
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

      return (
        <div style={{ width: '100%', height: '100%' }}>
          <GameRoomLayout
            getGameComponent={(dimensions) => (
              <ChessGame
                homeColor="black"
                playable
                pgn=""
                getBoardSize={() => dimensions.width - 100}
              />
            )}
            getSideComponent={(dimensions) => (
              <StreamingBox
                me={me}
                peer={opponent}
                width={dimensions.width}
              />
            )}
          />
        </div>
      );
    }}
    />
  </Grommet>
);
