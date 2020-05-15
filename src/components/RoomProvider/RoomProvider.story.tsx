/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { RoomProvider } from './RoomProvider';
import { SocketProvider } from '../SocketProvider';
import { RoomInfoDisplay } from '../RoomInfoDisplay';
import { RoomStats } from '../RoomStats';


export default {
  component: RoomProvider,
  title: 'Components/RoomProvider',
};

export const defaultStory = () => (
  <SocketProvider>
    <RoomProvider
      id="1"
      render={({ me, room }) => (
        <>
          <RoomInfoDisplay
            me={me}
            room={room}
            gameInProgress={false}
            playersById={{}}
          />
          <RoomStats room={room} />
        </>
      )}
      renderFallback={() => (
        <div>doesnt work</div>
      )}
    />
  </SocketProvider>
);
