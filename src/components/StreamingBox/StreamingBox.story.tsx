/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { StreamingBox, StreamingBoxProps } from './StreamingBox';
import { getRandomInt, range } from 'src/lib/util';
import { useInterval } from 'src/lib/hooks';
import { Peer, Room } from 'src/providers/PeerProvider';

export default {
  component: StreamingBox,
  title: 'components/StreamingBox',
};

const peerMock = new PeerMocker();
const roomMocker = new RoomMocker();

const getPeers = (stream: MediaStream, count: number) =>
  range(count).map(() =>
    peerMock.withChannels({
      streaming: {
        on: true,
        type: 'audio-video',
        stream,
      },
    })
  );

const getRoom = (me: Peer, peers: Peer[]) =>
  roomMocker.withProps({
    me: me,
    peers: peers.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next,
      }),
      {}
    ),
    name: 'Valencia',
    isPrivate: false,
  });

const getRoomWithPeers = (stream: MediaStream, count: number) => {
  const peers = getPeers(stream, count);
  const me = getPeers(stream, 1)[0];

  return getRoom(me, peers);
};

type Props = {
  room: Room;
  focusOnPeerId?: string;
} & StreamingBoxProps;
const Component: React.FC<Props> = ({ room, focusOnPeerId, ...streamingBoxProps }) => {
  return (
      <div
        style={{
          padding: '30px',
        }}
      >
        <StreamingBox
          room={room}
          // width={600}
          // aspectRatio={}
          {...(focusOnPeerId &&
            room.peers[focusOnPeerId] && {
              focusedPeerId: room.peers[focusOnPeerId].id,
            })}
          {...streamingBoxProps}
        />
      </div>
  );
};

export const defaultStory = () => (
  <WithLocalStream
    constraints={{ audio: true, video: true }}
    render={(stream) => {
      const room = getRoomWithPeers(stream, 2);

      return <Component room={room} />;
    }}
  />
);

export const justMe = () => (
  <WithLocalStream
    constraints={{ audio: true, video: true }}
    render={(stream) => {
      const room = getRoomWithPeers(stream, 0);

      return <Component room={room} mainOverlay={() => <div>Yey</div>} />;
    }}
  />
);

export const oneOnOne = () => (
  <WithLocalStream
    constraints={{ audio: true, video: true }}
    render={(stream) => {
      const room = getRoomWithPeers(stream, 1);

      return <Component room={room} />;
    }}
  />
);

export const oneOnOneWithFooterAndHeader = () => (
  <WithLocalStream
    constraints={{ audio: true, video: true }}
    render={(stream) => {
      const room = getRoomWithPeers(stream, 1);

      return (
        <Component
          room={room}
          headerOverlay={({ inFocus }) => <div>Header: {inFocus.name}</div>}
          mainOverlay={() => <div>Main</div>}
          footerOverlay={({ inFocus }) => <div>Footer: {inFocus.name}</div>}
        />
      );
    }}
  />
);

export const multipleStreamsWithFooterAndHeader = () => (
  <WithLocalStream
    constraints={{ audio: true, video: true }}
    render={(stream) => {
      const room = getRoomWithPeers(stream, 8);

      return (
        <Component
          room={room}
          headerOverlay={({ inFocus }) => <div>Header: {inFocus.name}</div>}
          footerOverlay={({ inFocus }) => <div>Footer: {inFocus.name}</div>}
        />
      );
    }}
  />
);

export const withFourStreams = () => (
  <WithLocalStream
    constraints={{ audio: true, video: true }}
    render={(stream) => {
      const room = getRoomWithPeers(stream, 4);

      return <Component room={room} />;
    }}
  />
);

export const withSixStreams = () => (
  <WithLocalStream
    constraints={{ audio: true, video: true }}
    render={(stream) => {
      const room = getRoomWithPeers(stream, 6);

      return <Component room={room} />;
    }}
  />
);

export const withRandomFocusChange = () => (
  <WithLocalStream
    constraints={{ audio: true, video: true }}
    render={(stream) => {
      const peerCount = 3;
      const room = getRoomWithPeers(stream, peerCount);

      return React.createElement(() => {
        const [focusOnId, setFocusOnId] = useState(room.peers[Object.keys(room.peers)[0]].id);

        const [interval, setInterval] = useState(3);
        useInterval(() => {
          const nextFocusIndex = getRandomInt(0, peerCount - 1);

          setFocusOnId(room.peers[Object.keys(room.peers)[nextFocusIndex]].id);
          setInterval(getRandomInt(1, 6));
        }, interval * 1000);

        return <Component room={room} focusOnPeerId={focusOnId} />;
      });
    }}
  />
);

export const withRandomAddingOrRemovingStreamers = () => (
  <WithLocalStream
    constraints={{ audio: true, video: true }}
    render={(stream) => {
      const peerCount = 2;

      return React.createElement(() => {
        const [room, setRoom] = useState(() => getRoomWithPeers(stream, peerCount));

        const [interval, setInterval] = useState(3);
        useInterval(() => {
          setRoom((prev) => {
            const nextDiff = getRandomInt(0, 2);

            if (nextDiff === 0) {
              const peerIds = Object.keys(prev.peers);
              const randomPeerId = peerIds[getRandomInt(0, peerIds.length - 1)];
              const { [randomPeerId]: removed, ...nextPeers } = prev.peers;

              return {
                ...prev,
                peers: nextPeers,
              };
            }

            const newPeer = getPeers(stream, 1)[0];
            const nextPeers = {
              ...prev.peers,
              [newPeer.id]: newPeer,
            };

            return {
              ...prev,
              peers: nextPeers,
            };
          });

          setInterval(getRandomInt(1, 6));
        }, interval * 1000);

        return <Component room={room} />;
      });
    }}
  />
);

export const withRandomAddingOrRemovingStreamersAndFocusChange = () => (
  <WithLocalStream
    constraints={{ audio: true, video: true }}
    render={(stream) => {
      const peerCount = 2;

      return React.createElement(() => {
        const [room, setRoom] = useState(() => getRoomWithPeers(stream, peerCount));
        const [focusOnId, setFocusOnId] = useState(room.peers[Object.keys(room.peers)[0]].id);

        const [interval, setInterval] = useState(3);

        useInterval(() => {
          setRoom((prev) => {
            const nextDiff = getRandomInt(0, 2);

            if (nextDiff === 0) {
              const peerIds = Object.keys(prev.peers);
              const randomPeerId = peerIds[getRandomInt(0, peerIds.length - 1)];
              const { [randomPeerId]: removed, ...nextPeers } = prev.peers;

              console.log('removing', nextPeers);
              return {
                ...prev,
                peers: nextPeers,
              };
            }

            const newPeer = getPeers(stream, 1)[0];
            const nextPeers = {
              ...prev.peers,
              [newPeer.id]: newPeer,
            };

            console.log('adding', nextPeers);
            return {
              ...prev,
              peers: nextPeers,
            };
          });

          setInterval(getRandomInt(1, 6));
        }, interval * 1000);

        useInterval(() => {
          const nextFocusIndex = getRandomInt(0, peerCount - 1);

          setFocusOnId(room.peers[Object.keys(room.peers)[nextFocusIndex]].id);
          setInterval(getRandomInt(1, 6));
        }, interval * 700);

        return <Component room={room} focusOnPeerId={focusOnId} />;
      });
    }}
  />
);
