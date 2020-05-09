import React from 'react';
import { RoomInfoDisplay, RoomInfoProps } from './RoomInfoDisplay';


export default {
  component: RoomInfoDisplay,
  title: 'Modules/Room Info Display/ Room Info Component',
};

const mockedProps: RoomInfoProps = {
  me: 'Batman',
  peers: ['Kasparov', 'Hank', 'Fred', 'Jason', 'Joker'],
  roomName: 'Horny Fuckers',
  roomID: '002',
  onLeaveRoom: () => console.log('leave room'),
  onInviteNewPeer: () => console.log('invite new peer'),
  onChallenge: () => console.log('challenge peer'),
};
export const RoomInfoComponent = () => (
  <div>
    <RoomInfoDisplay {...mockedProps} />
  </div>

);
