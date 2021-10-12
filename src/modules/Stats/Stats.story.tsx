/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { getRandomInt, range } from 'src/lib/util';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { Stats } from './Stats';


export default {
  component: Stats,
  title: 'modules/Stats',
};

const roomMocker = new RoomMocker();
const peerMocker = new PeerMocker();

export const defaultStory = () => React.createElement(() => {

  const rooms = range(getRandomInt(4, 14)).map(() => roomMocker.record());
  const peers = range(getRandomInt(4, 14)).map(() => peerMocker.record());

  return (
      <Stats rooms={rooms} peers={peers} />
  )
})