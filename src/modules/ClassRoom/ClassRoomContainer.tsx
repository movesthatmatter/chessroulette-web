import React from 'react';
import { PeerConsumer, PeerProvider, PeerProviderProps } from 'src/components/PeerProvider';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'src/services/Authentication/selectors';
import { Layer, Box } from 'grommet';
import { OnboardingWidget } from 'src/modules/Onboarding/components/OnboardingWidget';
import { ClassRoom } from './ClassRoom';

type Props = {
  roomCredentials: PeerProviderProps['roomCredentials'];
};

export const ClassRoomContainer: React.FC<Props> = (props) => {
  const auth = useSelector(selectAuthentication);

  if (!auth.isAuthenticated) {
    return (
      <Layer>
        <Box pad="medium">
          <OnboardingWidget mode="student" />
        </Box>
      </Layer>
    );
  }

  return (
  // having the PeerProvider here is probably not the best but it's OK for now
  //  The point of the splitting it so the consumer can be used further down
  //  in the chat, study, game, etc., so the state can pe managed locally
    <PeerProvider
      roomCredentials={props.roomCredentials}
      userId={auth.user.id}
    >
      <PeerConsumer
        render={(p) => <ClassRoom {...p} />}
        renderFallback={() => <AwesomeLoaderPage />}
      />
    </PeerProvider>
  );
};
