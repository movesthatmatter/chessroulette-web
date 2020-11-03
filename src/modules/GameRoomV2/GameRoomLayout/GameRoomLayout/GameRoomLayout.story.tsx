/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { ChessGame } from 'src/modules/Games/Chess';
import { StreamingBox } from 'src/components/StreamingBox';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { GameRoomLayout } from './GameRoomLayout';

export default {
  component: GameRoomLayout,
  title: 'modules/GameRoomV2/GameRoomLayout',
};

const peerMock = new PeerMocker();
const roomMocker = new RoomMocker();

export const empty = () => (
  <Grommet theme={defaultTheme} full>
    <div style={{
      width: '100%',
      height: '100%',
      background: '#ededed',
    }}>
      <GameRoomLayout
        topHeight={0}
        getTopComponent={() => null}
        bottomHeight={0}
        getBottomComponent={() => null}
        getGameComponent={(dimensions) => (
          <div style={{
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: 'red',
          }}/>
        )}
        getLeftSideComponent={(dimensions) => (
          <div style={{
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: 'blue',
          }}/>
        )}
        getRightSideComponent={(dimensions) => (
          <div style={{
            width: dimensions.width,
            height: dimensions.height + dimensions.verticalPadding,
            backgroundColor: 'green',
          }}/>
        )}
      />
    </div>
  </Grommet>
)

export const withChessGame = () => (
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

      const publicRoom = roomMocker.withProps({
        me,
        peers: {
          [opponent.id]: opponent,
        },
        name: 'Valencia',
        type: 'public',
      });

      publicRoom

      return (
        <div style={{ width: '100%', height: '100%' }}>
          <GameRoomLayout
            topHeight={0}
            getTopComponent={() => null}
            bottomHeight={0}
            getBottomComponent={() => null}
            getGameComponent={(dimensions) => (
              <ChessGame
                homeColor="black"
                playable
                pgn=""
                getBoardSize={() => dimensions.width - 100}
              />
            )}
            getLeftSideComponent={() => (<></>)}
            getRightSideComponent={(dimensions) => (
              <StreamingBox
                room={publicRoom}
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
