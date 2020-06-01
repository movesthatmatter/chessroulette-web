import React from 'react';
import { PeerConsumer, PeerProvider, PeerProviderProps } from 'src/components/PeerProvider';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { ClassRoom } from './ClassRoom';

type Props = {
  roomCredentials: PeerProviderProps['roomCredentials'];
};

export const ClassRoomContainer: React.FC<Props> = (props) => (
  // having the PeerProvider here is probably not the best but it's OK for now
  //  The point of the splitting it so the consumer can be used further down
  //  in the chat, study, game, etc., so the state can pe managed locally
  <PeerProvider
    roomCredentials={props.roomCredentials}
    userId={JSON.parse(window.localStorage.getItem('user') || '').id}
  >
    <PeerConsumer
      render={(p) => <ClassRoom {...p} />}
      renderFallback={() => <AwesomeLoaderPage />}
    />
  </PeerProvider>
);
