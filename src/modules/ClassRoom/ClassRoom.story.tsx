/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { range } from 'src/lib/util';
import { Grommet } from 'grommet';
import { Peer } from 'src/components/RoomProvider';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { defaultTheme } from 'src/theme';
import { SocketProvider } from 'src/components/SocketProvider';
import { ClassRoom } from './ClassRoom';
import { ClassRoomContainer } from './ClassRoomContainer';


export default {
  component: ClassRoom,
  title: 'Modules/ClassRoom',
};

const roomMocker = new RoomMocker();
const peerMocker = new PeerMocker();

const roomPeers = range(2).map(() => peerMocker.record());
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

// export const defaultStory = () => (
//   <Grommet theme={defaultTheme} full>
//     <WithLocalStream render={(stream) => (
//       <ClassRoom room={{
//         ...room,
//         me: getPeerWithStream(room.me, stream),
//         peers: addStreamToPeers(room.peers, stream),
//       }}
//       />
//     )}
//     />
//   </Grommet>
// );

export const withContainer = () => (
  <Grommet theme={defaultTheme} full>
    <SocketProvider>
      {/* <WithLocalStream render={(stream) => ( */}
      <ClassRoomContainer
        roomCredentials={{ id: '1' }}
      />
      {/* )}
    /> */}
    </SocketProvider>
  </Grommet>
);
