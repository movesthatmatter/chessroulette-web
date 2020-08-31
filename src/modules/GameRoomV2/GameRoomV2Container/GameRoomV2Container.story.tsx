/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { SocketProvider } from 'src/components/SocketProvider';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { PeerProvider, PeerConsumer } from 'src/components/PeerProvider';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { ChessGameState, reduceChessGame } from 'src/modules/Games/Chess';
import { action } from '@storybook/addon-actions';
import { Page } from 'src/components/Page';
import { UserInfoMocker } from 'src/mocks/records';
import { GameRoomV2Container } from './GameRoomV2Container';

export default {
  component: GameRoomV2Container,
  title: 'modules/GameRoomV2/GameRoomV2 Container',
};

const peerMock = new PeerMocker();
const userInfoMock = new UserInfoMocker();

export const withoutGame = () => (
  <Grommet theme={defaultTheme} full>
    <SocketProvider>
      <PeerProvider
        roomCredentials={{
          id: '1',
        }}
        // This might not allow it to work with sockets
        userInfo={userInfoMock.withProps({ id: '1' })}
      >
        <GameRoomV2Container />
      </PeerProvider>
    </SocketProvider>
  </Grommet>
);

export const withGame = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream render={(stream) => (
      <SocketProvider>
        <PeerProvider
          roomCredentials={{
            id: '1',
          }}
          // This might not allow it to work with sockets
          userInfo={userInfoMock.withProps({ id: '1' })}
        >
          <PeerConsumer render={(p) => React.createElement(() => {
            const me = peerMock.withProps(p.room.me);

            const opponent = peerMock.withChannels({
              streaming: {
                on: true,
                type: 'audio-video',
                stream,
              },
            });

            const [currentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
              playersBySide: {
                away: opponent.user,
                home: me.user,
              },
              homeColor: 'white',
              timeLimit: 'blitz',
            }));

            return (
              <Page>
                <GameRoomV2Container
                  game={currentGame}
                  onGameStateUpdate={action('on game state update')}
                  opponent={opponent}
                />
              </Page>
            );
          })}
          />
        </PeerProvider>
      </SocketProvider>
    )}
    />
  </Grommet>
);
