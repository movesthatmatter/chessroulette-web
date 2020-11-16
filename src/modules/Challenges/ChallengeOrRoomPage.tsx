import { AsyncResult, ChallengeRecord, RoomRecord } from 'dstnd-io';
import { Box } from 'grommet';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Page } from 'src/components/Page';
import { toRoomUrlPath } from 'src/lib/util';
import { resources } from 'src/resources';
import { ChallengeInfo } from './ChallengeInfo';
import { GenericRoom } from 'src/modules/GenericRoom';
import { selectMyPeer } from 'src/components/PeerProvider';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { Events } from 'src/services/Analytics';
import { ChallengePage } from './ChallengePage';

type Props = {};

export const ChallengeOrRoomPage: React.FC<Props> = () => {
  const params = useParams<{ slug: string }>();
  const [challenge, setChallenge] = useState<ChallengeRecord>();
  const [room, setRoom] = useState<RoomRecord>();

  const [resourceState, setResourceState] = useState('none' as 'none' | 'loading' | 'error' | 'success');

  const myPeer = useSelector(selectMyPeer);

  useEffect(() => {
    setResourceState('loading');

    resources
      .getRoomBySlug(params.slug)
      .map(setRoom)
      .flatMapErr(() => resources.getChallengeBySlug(params.slug).map(setChallenge))
      .map(AsyncResult.passThrough(() => {
        setResourceState('success');
      }))
      .mapErr(() => {
        setResourceState('error');
      });
  }, []);

  if (resourceState === 'loading') {
    return <AwesomeLoaderPage />;
  }

  if (resourceState === 'error') {
    return <AwesomeErrorPage errorType="resourceNotFound" />;
  }

  if (room) {
    return (
      <GenericRoom
        roomCredentials={{
          id: room.id,
          code: room.code || undefined,
        }}
      />
    );
  } else if (challenge) {
    return (
      <ChallengePage 
        challenge={challenge}
        myPeer={myPeer}
      />
    );
  }

  return null;
};
