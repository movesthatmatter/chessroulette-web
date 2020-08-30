/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { SocketProvider } from 'src/components/SocketProvider';
import { PeerProvider } from 'src/components/PeerProvider';
import { GameRoomV2Page } from './GameRoomV2Page';

export default {
  component: GameRoomV2Page,
  title: 'modules/GameRoomV2/Game Room V2 Page',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <SocketProvider>
      {/* <PeerProvider
        roomCredentials={{
          id: '1',
        }}
        // This might not allow it to work with sockets
        userId="1"
      > */}
      <GameRoomV2Page />
      {/* </PeerProvider> */}
    </SocketProvider>
  </Grommet>
);
