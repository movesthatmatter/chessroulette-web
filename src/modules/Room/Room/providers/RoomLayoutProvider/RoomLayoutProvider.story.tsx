/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker } from 'src/mocks/records';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { RoomLayoutProvider } from './RoomLayoutProvider';
import { JoinedRoom } from '../../../types';
import { toRoomMember } from '../../util';

export default {
  component: RoomLayoutProvider,
  title: 'modules/Room/RoomLayoutProvider',
};

const gameMocker = new GameMocker();
const roomMocker = new RoomMocker();

const game = gameMocker.started();
const room = roomMocker.record();
const joinedRoom: JoinedRoom = {
  ...room,
  currentActivity: {
    type: 'play',

    // TODO: Fix this Jul 29 1:05am
    // iamParticipating: true,
    // game: game,
    // participants: {
    //   me: 
    // }
    // gameId: game.id,
    // game,
    // participants: {
      
    // },
  },
  members:  Object.values(room.peersIncludingMe).map(toRoomMember).reduce((prev, member) => ({
    ...prev,
    [member.userId]: member,
  }), {} as JoinedRoom['members']),
};

export const roomWithPlayActivity = () => (
  <StorybookBaseProvider withAuthentication>
    <RoomLayoutProvider joinedRoom={joinedRoom} />
  </StorybookBaseProvider>
);
