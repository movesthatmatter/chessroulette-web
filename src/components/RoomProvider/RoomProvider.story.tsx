/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { TV } from 'src/modules/GameRoom/components/TV';
import { RoomProvider } from './RoomProvider';
import { SocketProvider } from '../SocketProvider';
import { RoomInfoDisplay } from '../RoomInfoDisplay';
import { RoomStats } from '../RoomStats';


export default {
  component: RoomProvider,
  title: 'Components/RoomProvider',
};

export const withRoomStats = () => (
  <SocketProvider>
    <RoomProvider
      id="1" // publix
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

export const withStreaming = () => (
  <SocketProvider>
    <RoomProvider
      id="1" // publix
      render={({ me, room }) => (
        <>
          <RoomStats room={room} />
          <TV
            width={100}
            streamConfig={me.connection.channels.streaming}
          />
          <div>
            Peers
            <ul>
              {Object.values(room.peers).map((peer) => (
                <li key={peer.id}>
                  <TV
                    width={100}
                    streamConfig={peer.connection.channels.streaming}
                  />
                  <div>{peer.name}</div>
                </li>
              ))}
            </ul>
          </div>
          {/* <RoomInfoDisplay
            me={me}
            room={room}
            gameInProgress={false}
            playersById={{}}
          /> */}
          {/* <RoomStats room={room} /> */}
        </>
      )}
      renderFallback={() => (
        <div>doesnt work</div>
      )}
    />
  </SocketProvider>
);
