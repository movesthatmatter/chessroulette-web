import React from 'react';
import { PeerProvider, PeerProviderProps } from 'src/components/PeerProvider';
import { ClassRoom } from './ClassRoom';

type Props = {
  roomCredentials: PeerProviderProps['roomCredentials'];
};

export const ClassRoomContainer: React.FC<Props> = (props) => (
  <PeerProvider
    roomCredentials={props.roomCredentials}
    render={({ room }) => (
      <ClassRoom
        room={room}
      />
    )}
  />
);
