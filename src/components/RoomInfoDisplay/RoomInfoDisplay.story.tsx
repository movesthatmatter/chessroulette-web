/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import StoryRouter from 'storybook-react-router';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import Chance from 'chance';
import { UserInfoMocker } from 'src/mocks/records';
import { RoomInfoDisplay } from './RoomInfoDisplay';
import { Peer } from '../RoomProvider';

export default {
  component: RoomInfoDisplay,
  title: 'Components/Room Info Display',
  decorators: [StoryRouter()],
};

const chance = new Chance();
const roomMocker = new RoomMocker();
const peerMocker = new PeerMocker();
const userInfoMocker = new UserInfoMocker();

const me = peerMocker.withProps({
  user: {
    name: 'Aristotel',
    id: '1',
    avatarId: '1',
  },
});
const roomPeers = [
  // These could've been automted but I wanted to maintain the names :)
  peerMocker.withProps(userInfoMocker.withProps({ name: 'Broasca' })),
  peerMocker.withProps(userInfoMocker.withProps({ name: 'Piper' })),
  peerMocker.withProps(userInfoMocker.withProps({ name: 'Jartica' })),
  peerMocker.withProps(userInfoMocker.withProps({ name: 'Horny Predator' })),
  peerMocker.withProps(userInfoMocker.withProps({ name: 'Lebada' })),
];

const playersById = {
  [me.id]: me,
  [roomPeers[2].id]: roomPeers[2],
};

const publicRoom = roomMocker.withProps({
  me,
  peers: roomPeers.reduce((accum, peer) => ({
    ...accum,
    [peer.id]: peer,
  }), {}),
  name: 'Valencia',
  type: 'public',
});

const privateRoom = roomMocker.withProps({
  me,
  peers: roomPeers.reduce((accum, peer) => ({
    ...accum,
    [peer.id]: peer,
  }), {}),
  name: 'Valencia',
  type: 'private',
});

const emptyRoom = roomMocker.withProps({
  me,
  peers: {},
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

const getPeersWithSomeStreams = (
  peersMap: Record<string, Peer>,
  stream: MediaStream,
): Record<string, Peer> => Object.values(peersMap).reduce((accum, peer) => ({
  ...accum,
  [peer.id]: chance.integer({ min: 0, max: 1 })
    ? getPeerWithStream(peer, stream)
    : peer,
}), {});

export const PublicRoom = () => (
  <WithLocalStream
    render={(localStream) => (
      <RoomInfoDisplay
        me={publicRoom.me}
        room={{
          ...publicRoom,
          peers: getPeersWithSomeStreams(publicRoom.peers, localStream),
        }}
        onLeaveRoom={action('leave room!')}
        onInviteNewPeer={action('invite new one')}
        playersById={playersById}
        gameInProgress={false}
      />
    )}
  />
);

export const PrivateRoom = () => (
  <WithLocalStream
    render={(localStream) => (
      <RoomInfoDisplay
        me={privateRoom.me}
        room={{
          ...privateRoom,
          peers: getPeersWithSomeStreams(privateRoom.peers, localStream),
        }}
        onLeaveRoom={action('leave room!')}
        onInviteNewPeer={action('invite new one')}
        playersById={playersById}
        gameInProgress={false}
      />
    )}
  />
);

export const RoomWithSomeVideosOnly = () => (
  <WithLocalStream
    render={(localStream) => (
      <RoomInfoDisplay
        me={privateRoom.me}
        room={{
          ...privateRoom,
          peers: getPeersWithSomeStreams(privateRoom.peers, localStream),
        }}
        onLeaveRoom={action('leave room!')}
        onInviteNewPeer={action('invite new one')}
        playersById={playersById}
        gameInProgress={false}
      />
    )}
  />
);

export const NoVideo = () => React.createElement(() => (
  <div style={{ display: 'flex', width: '350px' }}>
    <RoomInfoDisplay
      me={publicRoom.me}
      room={publicRoom}
      onLeaveRoom={action('leave room!')}
      onInviteNewPeer={action('invite new one')}
      playersById={playersById}
      gameInProgress={false}
    />
  </div>
));

export const NoVideoGameInProgress = () => React.createElement(() => (
  <div style={{ display: 'flex', width: '350px' }}>
    <RoomInfoDisplay
      me={publicRoom.me}
      room={publicRoom}
      onLeaveRoom={action('leave room!')}
      onInviteNewPeer={action('invite new one')}
      playersById={playersById}
      gameInProgress
    />
  </div>
));

export const NoPeersJoinedYet = () => React.createElement(() => (
  <div style={{ display: 'flex', width: '350px' }}>
    <RoomInfoDisplay
      me={emptyRoom.me}
      room={emptyRoom}
      onLeaveRoom={action('leave room!')}
      onInviteNewPeer={action('invite new one')}
      playersById={{}}
      gameInProgress={false}
    />
  </div>
));
