import { AsyncResult, ChallengeRecord, RoomRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { resources } from 'src/resources';
import { usePeerState } from 'src/components/PeerProvider';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { ChallengePage } from './ChallengePage';
import { GenericRoomPage } from '../GenericRoom/GenericRoom/GenericRoomPage';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'src/services/Authentication';
import { PendingChallenge } from '../Games/Chess/components/PendingChallenge/PendingChallenge';
import { ChallengeWidget } from './Widgets/ChallengeWidget';
import { Page } from 'src/components/Page';

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
    return (
      <GenericRoomPage roomInfo={roomInfo} />
    );
  }

  if (challenge) {
    return (
      <Page>
        <ChallengeWidget
          challenge={challenge}
          onAccepted={setRoomInfo}
          onCanceled={() => {
            console.log('history', history)
            history.length > 2 ? history.goBack() : history.push('/')
          }}
        />
      </Page>
    );
  }

  if (resourceState === 'error') {
    return <AwesomeErrorPage errorType="resourceNotFound" />;
  }

  // This should be something more specific!
  return <AwesomeLoaderPage />;
};
