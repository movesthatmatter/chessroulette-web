/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { range, getRandomInt } from 'src/lib/util';
import { Grommet } from 'grommet';
import { Peer } from 'src/components/RoomProvider';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { defaultTheme } from 'src/theme';
import { SocketProvider } from 'src/components/SocketProvider';
import { PeerProvider, PeerConsumer } from 'src/components/PeerProvider';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { ReduxProvider } from 'src/redux/Provider';
import { UserRecordMocker } from 'src/mocks/records';
import { ClassRoom } from './ClassRoom';

export default {
  component: ClassRoom,
  title: 'Modules/ClassRoom',
};

const roomMocker = new RoomMocker();
const peerMocker = new PeerMocker();
const userRecordMocker = new UserRecordMocker();

const roomPeers = range(10).map(() => peerMocker.record());
const room = roomMocker.withProps({
  peers: roomPeers.reduce((accum, peer) => ({
    ...accum,
    [peer.id]: peer,
  }), {}),
});

const getPeerWithStream = (p: Peer, stream: MediaStream): Peer => ({
  ...p,
  connection: {
    ...p.connection,
    channels: {
      ...p.connection.channels,
      streaming: {
        on: true,
        type: 'audio-video',
        stream,
      },
    },
  },
});

const addStreamToPeers = (
  peersMap: Record<string, Peer>,
  stream: MediaStream,
): Record<string, Peer> => Object.values(peersMap).reduce((accum, peer) => ({
  ...accum,
  [peer.id]: getPeerWithStream(peer, stream),
}), {});

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream render={(stream) => (
      <SocketProvider>
        <PeerProvider>
          <PeerConsumer
            renderRoomJoined={(p) => (
              <ClassRoom
                {...p}
                room={{
                  ...p.room,
                  me: getPeerWithStream(room.me, stream),
                  peers: addStreamToPeers(room.peers, stream),
                }}
                initialMode="study"
              />
            )}
            renderFallback={() => <AwesomeLoaderPage />}
          />
        </PeerProvider>
      </SocketProvider>
    )}
    />
  </Grommet>
);

export const withPeerProvider = () => (
  <ReduxProvider>
    <Grommet theme={defaultTheme} full>
      <SocketProvider>
        <PeerProvider>
          <PeerConsumer
            renderRoomJoined={(p) => <ClassRoom {...p} />}
            renderFallback={() => <AwesomeLoaderPage />}
          />
        </PeerProvider>
      </SocketProvider>
    </Grommet>
  </ReduxProvider>
);
