import { AsyncResult, ChallengeRecord, RoomRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { resources } from 'src/resources';
import { usePeerState } from 'src/providers/PeerProvider';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'src/services/Authentication';
import { ChallengePage } from './ChallengePage';
import { AwesomeErrorWithAction } from 'src/components/AwesomeErrorWithAction/AwesomeErrorWithAction';
import { RoomRoute } from '../RoomV3/RoomRoute';
import { Room } from '../RoomV3/Room';

type Props = {};

export const ChallengeOrRoomPage: React.FC<Props> = () => {
  const params = useParams<{ slug: string }>();
  const [challenge, setChallenge] = useState<ChallengeRecord>();
  const [roomInfo, setRoomInfo] = useState<RoomRecord>();
  const [resourceState, setResourceState] = useState(
    'none' as 'none' | 'loading' | 'error' | 'success'
  );
  const peerState = usePeerState();
  const auth = useSelector(selectAuthentication);
  const history = useHistory();

  useEffect(() => {
    // If there is no joinedRoom, roomInfo or challenge, load the possible Challenge or RoomInfo
    if (!(challenge || roomInfo) && resourceState === 'none') {
      setResourceState('loading');

      resources
        .getRoomBySlug(params.slug)
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
  }, [challenge, roomInfo, peerState]);

  if (auth.authenticationType === 'none') {
    // Show something more
    return null;
  }

  if (roomInfo) {
    // return <Room roomInfo={roomInfo} key={roomInfo.slug} />
    return <RoomRoute roomInfo={roomInfo} key={roomInfo.slug} />
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
