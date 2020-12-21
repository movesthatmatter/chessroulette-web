/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { UserRecordMocker } from 'src/mocks/records';
import { PeerProvider } from './PeerProvider';
import { SocketProvider } from '../SocketProvider';
import { FaceTime } from '../../components/FaceTime';
import { PeerConsumer } from './PeerConsumer';

export default {
  component: PeerProvider,
  title: 'Components/PeerConsumer',
};

const userRecordMocker = new UserRecordMocker();

export const defaultStory = () => (
  <SocketProvider>
    <PeerProvider>
      <PeerConsumer
        onReady={(p) => {
          if (p.state === 'notJoined') {
            p.joinRoom({
              id: '1',
            });
          }
        }}
        renderRoomJoined={({ room }) => (
          <>
            <div>
              {`Me: ${room.me.user.name}(${room.me.id})`}
              {room.me.connection.channels.streaming.on ? (
                <FaceTime
                  streamConfig={room.me.connection.channels.streaming}
                  muted
                />
              ) : (
                <p>Streaming not on</p>
              )}
            </div>
            <p>Peers:</p>
            <ul>
              {Object.values(room.peers).map(({ id, user, connection }) => (
                <div key={id}>
                  <div>{`${user.name}(${id})`}</div>
                  {connection.channels.streaming.on ? (
                    <FaceTime streamConfig={connection.channels.streaming} />
                  ) : (
                    <div>Streaming not on</div>
                  )}
                </div>
              ))}
            </ul>
          </>
        )}
      />
    </PeerProvider>
  </SocketProvider>
);
