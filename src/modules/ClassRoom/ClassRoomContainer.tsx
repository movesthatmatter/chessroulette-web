import React from 'react';
import { PeerConsumer, PeerProvider, PeerProviderProps } from 'src/components/PeerProvider';
import { ClassRoom } from './ClassRoom';

type Props = {
  roomCredentials: PeerProviderProps['roomCredentials'];
};

export const ClassRoomContainer: React.FC<Props> = (props) => (
  // having the PeerProvider here is probably not the best but it's OK for now
  //  The point of the splitting it so the consumer can be used further down
  //  in the chat, study, game, etc., so the state can pe managed locally
  <PeerProvider roomCredentials={props.roomCredentials}>
    <PeerConsumer
      render={({ room, broadcastMessage }) => (
        <ClassRoom
          room={room}
          broadcastMessage={broadcastMessage}
        />
      )}
    />
  </PeerProvider>
);
