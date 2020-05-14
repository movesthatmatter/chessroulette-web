/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { RoomStatsRecord, roomStatsRecord } from 'dstnd-io';
import { action } from '@storybook/addon-actions';
import { AVStreaming } from 'src/services/AVStreaming';
import StoryRouter from 'storybook-react-router';
import { PeerConnectionStatus } from 'src/services/peers';
import { RoomInfoDisplay } from './RoomInfoDisplay';
import { PeerConnections } from '../PeersProvider';

export default {
  component: RoomInfoDisplay,
  title: 'Components/Room Info Display',
  decorators: [StoryRouter()],
};


const peers = {
  1: {
    id: '1',
    name: 'Broasca',
  },
  2: {
    id: '2',
    name: 'Piper',
  },
  3: {
    id: '3',
    name: 'Jartica',
  },
  4: {
    id: '4',
    name: 'Kasparov',
  },
  5: {
    id: '5',
    name: 'Horny Predator',
  },
  6: {
    id: '6',
    name: 'Lebada',
  },
} as const;
const myId = peers[3].id;

const playersById = {
  1: {
    color: 'white',
    id: peers[1].id,
    name: peers[1].name,
  } as const,
  5: {
    color: 'black',
    id: peers[5].id,
    name: peers[5].name,
  } as const,
};

const publicRoom: RoomStatsRecord = {
  id: '0',
  name: 'Valencia',
  type: 'public',
  peersCount: Object.keys(peers).length,
  peers,
} as const;

const privateRoom: RoomStatsRecord = {
  id: '2',
  name: 'Berlin',
  peersCount: Object.keys(peers).length,
  peers,
  type: 'private',
  code: 'A33B22',
} as const;

const emptyRoom: RoomStatsRecord = {
  id: '3',
  name: 'Tokyo',
  peersCount: 1,
  peers: {
    1: {
      id: '1',
      name: 'Micul Print',
    },
  },
  type: 'private',
  code: 'A33B22',
} as const;

const getPeerConnections = (localStream: MediaStream) =>
  Object.values(peers).reduce(
    (res, peer) => ({
      ...res,
      [peer.id]: {
        peerId: peer.id,
        channels: {
          data: { on: true },
          streaming: {
            on: true,
            type: 'audio-video',
            stream: localStream,
          },
        },
      } as const,
    }),
    {},
  );

const getPeerConnectionsWithNoVideos = () =>
  Object.values(peers).reduce(
    (res, peer) => ({
      ...res,
      [peer.id]: {
        peerId: peer.id,
        channels: {
          data: { on: true },
          streaming: { on: false },
        },
      } as const,
    }),
    {},
  );


const getPeerConnectionsWithSomeVideo = (localStream: MediaStream) =>
  Object.values(peers).reduce(
    (res, peer) => {
      if (peer.id === '2' || peer.id === '3') {
        return {
          ...res,
          [peer.id]: {
            peerId: peer.id,
            channels: {
              data: { on: true },
              streaming: { on: false },
            },
          } as const,
        };
      }
      return {
        ...res,
        [peer.id]: {
          peerId: peer.id,
          channels: {
            data: { on: true },
            streaming: {
              on: true,
              type: 'audio-video',
              stream: localStream,
            },
          },
        } as const,
      };
    },
    {},
  );

export const PublicRoom = () => React.createElement(() => {
  const [localStream, setLocalStream] = useState<MediaStream | undefined>();

  useEffect(() => {
    const client = new AVStreaming();

    (async () => {
      setLocalStream(await client.start({ audio: false, video: true }));
    })();

    return () => {
      client.stop();
    };
  }, []);

  if (!localStream) {
    return null;
  }
  return (
    <div style={{ display: 'flex', width: '350px' }}>
      <RoomInfoDisplay
        me={peers[myId]}
        room={publicRoom}
        peerConnections={getPeerConnections(localStream)}
        onLeaveRoom={action('leave room!')}
        onInviteNewPeer={action('invite new one')}
        playersById={playersById}
        localStream={localStream}
        gameInProgress={false}
      />
    </div>
  );
});
export const PrivateRoom = () => React.createElement(() => {
  const [localStream, setLocalStream] = useState<MediaStream | undefined>();

  useEffect(() => {
    const client = new AVStreaming();

    (async () => {
      setLocalStream(await client.start({ audio: false, video: true }));
    })();

    return () => {
      client.stop();
    };
  }, []);

  if (!localStream) {
    return null;
  }
  return (
    <div style={{ display: 'flex', width: '350px' }}>
      <RoomInfoDisplay
        me={peers[myId]}
        room={privateRoom}
        peerConnections={getPeerConnections(localStream)}
        onLeaveRoom={action('leave room!')}
        onInviteNewPeer={action('invite new one')}
        playersById={playersById}
        localStream={localStream}
        gameInProgress={false}
      />
    </div>
  );
});


export const RoomWithSomeVideosOnly = () => React.createElement(() => {
  const [localStream, setLocalStream] = useState<MediaStream | undefined>();

  useEffect(() => {
    const client = new AVStreaming();

    (async () => {
      setLocalStream(await client.start({ audio: false, video: true }));
    })();

    return () => {
      client.stop();
    };
  }, []);

  if (!localStream) {
    return null;
  }
  return (
    <div style={{ display: 'flex', width: '350px' }}>
      <RoomInfoDisplay
        me={peers[myId]}
        room={publicRoom}
        peerConnections={getPeerConnectionsWithSomeVideo(localStream)}
        onLeaveRoom={action('leave room!')}
        onInviteNewPeer={action('invite new one')}
        playersById={playersById}
        localStream={localStream}
        gameInProgress
      />
    </div>
  );
});


export const NoVideo = () => React.createElement(() => (
  <div style={{ display: 'flex', width: '350px' }}>
    <RoomInfoDisplay
      me={peers[myId]}
      room={publicRoom}
      peerConnections={getPeerConnectionsWithNoVideos()}
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
      me={peers[myId]}
      room={publicRoom}
      peerConnections={getPeerConnectionsWithNoVideos()}
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
      me={emptyRoom.peers[1]}
      room={emptyRoom}
      peerConnections={{}}
      onLeaveRoom={action('leave room!')}
      onInviteNewPeer={action('invite new one')}
      playersById={{}}
      gameInProgress={false}
    />
  </div>
));
