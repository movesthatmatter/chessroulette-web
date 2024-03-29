import { ChallengeRecord, RoomRecord } from 'chessroulette-io';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'src/services/Authentication';
import { ChallengePage } from './ChallengePage';
import { AwesomeErrorWithAction } from 'src/components/AwesomeErrorWithAction/AwesomeErrorWithAction';
import { RoomRoute, resources as roomResources } from 'src/modules/Room';
import { resources } from 'src/resources';
import { AsyncResult } from 'ts-async-results';
import { usePeerConnection } from 'src/providers/PeerConnectionProvider';

type Props = {};

export const ChallengeOrRoomPage: React.FC<Props> = () => {
  const params = useParams<{ slug: string }>();
  const [challenge, setChallenge] = useState<ChallengeRecord>();
  const [roomInfo, setRoomInfo] = useState<RoomRecord>();
  const [resourceState, setResourceState] = useState(
    'none' as 'none' | 'loading' | 'error' | 'success'
  );
  const pc = usePeerConnection();
  const auth = useSelector(selectAuthentication);
  const history = useHistory();

  useEffect(() => {
    // If there is no joinedRoom, roomInfo or challenge, load the possible Challenge or RoomInfo
    if (!(challenge || roomInfo) && resourceState === 'none') {
      setResourceState('loading');

      roomResources
        .getRoom({ slug: params.slug })
        .map((room) => setRoomInfo(room))
        .flatMapErr(() => resources.getChallengeBySlug(params.slug).map(setChallenge))
        .map(
          AsyncResult.passThrough(() => {
            setResourceState('success');
          })
        )
        .mapErr(() => {
          setResourceState('error');
        });
    }
  }, [challenge, roomInfo, pc.ready]);

  if (auth.authenticationType === 'none') {
    // Show something more
    return null;
  }

  if (roomInfo) {
    // return <Room roomInfo={roomInfo} key={roomInfo.slug} />
    return <RoomRoute key={roomInfo.slug} />;
  }

  const goBackOrHome = () => {
    history.push('/');
  };

  if (challenge) {
    return (
      <ChallengePage
        challenge={challenge}
        onAccepted={setRoomInfo}
        onMatched={setRoomInfo}
        onDenied={goBackOrHome}
        onCanceled={goBackOrHome}
      />
    );
  }

  if (resourceState === 'error') {
    return (
      <AwesomeErrorWithAction
        title={`Ooops, it looks like the challenge doesn't exist anymore!`}
        desc="Why not create a new challenge?"
        mid="5"
        buttons={[
          {
            type: 'primary',
            label: 'OK',
            onClick: () => {
              history.push('/');
            },
          },
        ]}
      />
    );
  }

  // This should be something more specific!
  return <AwesomeLoaderPage />;
};
