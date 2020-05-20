/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { range } from 'src/lib/util';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { RoomStats } from './RoomStats';

export default {
  component: RoomStats,
  title: 'Components/RoomStats',
};

const roomMocker = new RoomMocker();
const peerMocker = new PeerMocker();

const peersWithDataConnections = range(5).map(() => peerMocker.withProps({
  connection: {
    channels: {
      data: { on: true },
      streaming: { on: false },
    },
  },
}));

export const withNoConnections = () => (
  <RoomStats room={roomMocker.record()} />
);

export const withDataConnections = () => (
  <RoomStats room={roomMocker.withProps({
    peers: peersWithDataConnections.reduce((accum, peer) => ({
      ...accum,
      [peer.id]: peer,
    }), {}),
  })}
  />
);
